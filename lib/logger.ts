'use client';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context: Record<string, unknown>;
  error?: {
    name?: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

const LOG_DB_KEY = 'dsm_logs';
const MAX_STORED_LOGS = 200;
const LOG_API_URL = '/api/logs';

const STORAGE_LIMIT_WARNED_KEY = 'dsm_log_storage_warned';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

function getLevelPriority(level: LogLevel): number {
  const priorities: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
  return priorities[level];
}

function canSendToServer(level: LogLevel): boolean {
  return getLevelPriority(level) >= getLevelPriority('warn');
}

function saveToStorage(entry: LogEntry): void {
  try {
    const raw = localStorage.getItem(LOG_DB_KEY);
    const logs: LogEntry[] = raw ? JSON.parse(raw) : [];
    logs.push(entry);
    if (logs.length > MAX_STORED_LOGS) {
      const removed = logs.splice(0, logs.length - MAX_STORED_LOGS);
      const warned = localStorage.getItem(STORAGE_LIMIT_WARNED_KEY);
      if (!warned) {
        console.warn(`[Logger] Storage limit reached. Discarded ${removed.length} old logs.`);
        localStorage.setItem(STORAGE_LIMIT_WARNED_KEY, 'true');
      }
    }
    localStorage.setItem(LOG_DB_KEY, JSON.stringify(logs));
  } catch {
    const warned = localStorage.getItem(STORAGE_LIMIT_WARNED_KEY);
    if (!warned) {
      console.warn('[Logger] localStorage full. Falling back to in-memory only.');
      localStorage.setItem(STORAGE_LIMIT_WARNED_KEY, 'true');
    }
  }
}

function sendToServer(entry: LogEntry): void {
  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      navigator.sendBeacon(LOG_API_URL, JSON.stringify(entry));
    } catch {
      fetch(LOG_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        keepalive: true,
      }).catch(() => {});
    }
  } else {
    fetch(LOG_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    }).catch(() => {});
  }
}

function createEntry(
  level: LogLevel,
  message: string,
  context: LogEntry['context'] = {},
  error?: unknown
): LogEntry {
  const entry: LogEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    level,
    message,
    context: {
      path: typeof window !== 'undefined' ? window.location.pathname : 'server',
      ...context,
    },
  };

  if (error instanceof Error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: (error as any).code,
    };
  } else if (error) {
    entry.error = {
      message: String(error),
    };
  }

  return entry;
}

function createLogger(component?: string) {
  const baseContext: LogEntry['context'] = {};
  if (component) baseContext.component = component;

  const log = (level: LogLevel, message: string, ctx?: LogEntry['context'], error?: unknown) => {
    const context = { ...baseContext, ...ctx };
    const entry = createEntry(level, message, context, error);

    const consoleFn = level === 'error' ? console.error
      : level === 'warn' ? console.warn
      : level === 'debug' ? console.debug
      : console.log;

    const prefix = component ? `[${component}]` : '[App]';
    const meta = ctx ? ` ${JSON.stringify(ctx)}` : '';
    const errInfo = entry.error ? ` | Error: ${entry.error.message}` : '';

    if (level === 'error' && entry.error?.stack) {
      consoleFn(`${prefix} ${message}${meta}`, entry.error.stack, entry);
    } else {
      consoleFn(`${prefix} ${message}${meta}${errInfo}`, entry);
    }

    try {
      saveToStorage(entry);
    } catch {
      // storage failed silently
    }

    if (canSendToServer(level)) {
      sendToServer(entry);
    }
  };

  return {
    debug: (message: string, ctx?: LogEntry['context']) => log('debug', message, ctx),
    info: (message: string, ctx?: LogEntry['context']) => log('info', message, ctx),
    warn: (message: string, ctx?: LogEntry['context'], error?: unknown) => log('warn', message, ctx, error),
    error: (message: string, ctx?: LogEntry['context'], error?: unknown) => log('error', message, ctx, error),
    time: (label: string) => {
      const start = performance.now();
      return {
        end: (message?: string, ctx?: LogEntry['context']) => {
          const duration = Math.round(performance.now() - start);
          log('info', message || `${label} completed`, { ...ctx, duration });
        },
      };
    },
  };
}

function getStoredLogs(): LogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function clearStoredLogs(): void {
  try {
    localStorage.removeItem(LOG_DB_KEY);
    localStorage.removeItem(STORAGE_LIMIT_WARNED_KEY);
  } catch {}
}

const appLogger = createLogger();

export type { LogLevel, LogEntry };
export { createLogger, getStoredLogs, clearStoredLogs };
export default appLogger;
