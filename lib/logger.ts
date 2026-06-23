/**
 * @module logger
 * @description Sistema de logging isomórfico (client + server) para o Digital Santa Maria.
 *
 * Funcionalidades:
 * - Logs estruturados com ID, timestamp, nível e contexto
 * - Persistência local via localStorage (apenas no client)
 * - Envio assíncrono para o servidor (warn/error) via sendBeacon/fetch
 * - Timer de performance para medir duração de operações
 *
 * @example
 * ```ts
 * import { createLogger } from '@/lib/logger';
 * const log = createLogger('MeuComponente');
 * log.info('Inicializado', { userId: '123' });
 * const timer = log.time('operação');
 * // ... operação ...
 * timer.end('concluído com sucesso');
 * ```
 */

// ─── Tipos ──────────────────────────────────────────────────────────

/** Níveis de log suportados */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Estrutura de uma entrada de log */
interface LogEntry {
  /** Identificador único da entrada */
  id: string;
  /** Timestamp ISO 8601 */
  timestamp: string;
  /** Nível de severidade */
  level: LogLevel;
  /** Mensagem descritiva */
  message: string;
  /** Contexto adicional (path, component, dados customizados) */
  context: Record<string, unknown>;
  /** Informações do erro, quando presente */
  error?: {
    name?: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

// ─── Constantes ─────────────────────────────────────────────────────

/** Chave de armazenamento dos logs no localStorage */
const LOG_DB_KEY = 'dsm_logs';

/** Número máximo de logs mantidos no localStorage */
const MAX_STORED_LOGS = 200;

/** Endpoint da API de logs do servidor */
const LOG_API_URL = '/api/logs';

/** Flag para evitar warning repetitivo de storage cheio */
const STORAGE_LIMIT_WARNED_KEY = 'dsm_log_storage_warned';

// ─── Helpers de ambiente ────────────────────────────────────────────

/** Verifica se estamos executando no browser */
const isBrowser = typeof window !== 'undefined';

/** Verifica se localStorage está disponível (pode estar desabilitado) */
function isLocalStorageAvailable(): boolean {
  if (!isBrowser) return false;
  try {
    const testKey = '__dsm_storage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// ─── Utilitários internos ───────────────────────────────────────────

/** Gera um ID único para cada entrada de log */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

/** Retorna a prioridade numérica de um nível de log */
function getLevelPriority(level: LogLevel): number {
  const priorities: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
  return priorities[level];
}

/** Determina se o log deve ser enviado ao servidor (warn + error) */
function canSendToServer(level: LogLevel): boolean {
  return getLevelPriority(level) >= getLevelPriority('warn');
}

// ─── Persistência local ─────────────────────────────────────────────

/**
 * Salva uma entrada de log no localStorage.
 * Aplica rotação automática quando o limite é atingido.
 * Falha silenciosamente se localStorage não está disponível.
 */
function saveToStorage(entry: LogEntry): void {
  if (!isLocalStorageAvailable()) return;

  try {
    const raw = localStorage.getItem(LOG_DB_KEY);
    const logs: LogEntry[] = raw ? JSON.parse(raw) : [];

    logs.push(entry);

    // Rotação: remove os mais antigos quando excede o limite
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
    // Falha silenciosa — localStorage pode estar cheio ou desabilitado
    try {
      const warned = localStorage.getItem(STORAGE_LIMIT_WARNED_KEY);
      if (!warned) {
        console.warn('[Logger] localStorage full. Falling back to in-memory only.');
        localStorage.setItem(STORAGE_LIMIT_WARNED_KEY, 'true');
      }
    } catch {
      // localStorage completamente indisponível
    }
  }
}

// ─── Envio para servidor ────────────────────────────────────────────

/**
 * Envia a entrada de log para o endpoint do servidor.
 * Usa `sendBeacon` quando disponível (melhor para unload events),
 * fallback para `fetch` com `keepalive`.
 */
function sendToServer(entry: LogEntry): void {
  const body = JSON.stringify(entry);

  if (isBrowser && 'sendBeacon' in navigator) {
    try {
      navigator.sendBeacon(LOG_API_URL, body);
      return;
    } catch {
      // Fallback para fetch
    }
  }

  fetch(LOG_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    ...(isBrowser ? { keepalive: true } : {}),
  }).catch(() => {
    // Falha silenciosa — servidor pode estar indisponível
  });
}

// ─── Criação de entradas ────────────────────────────────────────────

/**
 * Cria uma entrada de log estruturada com informações de contexto.
 * Inclui automaticamente o path atual (browser) ou 'server'.
 */
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
      path: isBrowser ? window.location.pathname : 'server',
      ...context,
    },
  };

  // Extrai informações do erro de forma segura
  if (error instanceof Error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: (error as Error & { code?: string }).code,
    };
  } else if (error !== undefined && error !== null) {
    entry.error = {
      message: String(error),
    };
  }

  return entry;
}

// ─── Factory principal ──────────────────────────────────────────────

/**
 * Cria uma instância de logger com contexto associado a um componente.
 *
 * @param component - Nome do componente/módulo para prefixo nos logs
 * @returns Objeto com métodos debug, info, warn, error e time
 *
 * @example
 * ```ts
 * const log = createLogger('AuthService');
 * log.info('Login iniciado', { provider: 'google' });
 * log.error('Login falhou', { userId }, error);
 * ```
 */
function createLogger(component?: string) {
  const baseContext: LogEntry['context'] = {};
  if (component) baseContext.component = component;

  const log = (level: LogLevel, message: string, ctx?: LogEntry['context'], error?: unknown): void => {
    const context = { ...baseContext, ...ctx };
    const entry = createEntry(level, message, context, error);

    // Seleciona o método de console apropriado
    // Espelha logs para o console apenas em desenvolvimento.
    if (process.env.NODE_ENV !== 'production') {
      const consoleFn = level === 'error' ? console.error
        : level === 'warn' ? console.warn
        : level === 'debug' ? console.debug
        : console.log;

      const prefix = component ? `[${component}]` : '[App]';
      const meta = ctx && Object.keys(ctx).length > 0 ? ` ${JSON.stringify(ctx)}` : '';
      const errInfo = entry.error ? ` | Error: ${entry.error.message}` : '';

      if (level === 'error' && entry.error?.stack) {
        consoleFn(`${prefix} ${message}${meta}`, entry.error.stack, entry);
      } else {
        consoleFn(`${prefix} ${message}${meta}${errInfo}`, entry);
      }
    }

    // Persiste no localStorage (apenas client-side)
    saveToStorage(entry);

    // Envia ao servidor se nível suficiente
    if (canSendToServer(level)) {
      sendToServer(entry);
    }
  };

  return {
    /** Log de depuração — apenas desenvolvimento */
    debug: (message: string, ctx?: LogEntry['context']): void => log('debug', message, ctx),
    /** Log informativo — operações normais */
    info: (message: string, ctx?: LogEntry['context']): void => log('info', message, ctx),
    /** Aviso — situações incomuns, enviado ao servidor */
    warn: (message: string, ctx?: LogEntry['context'], error?: unknown): void => log('warn', message, ctx, error),
    /** Erro — falhas, enviado ao servidor */
    error: (message: string, ctx?: LogEntry['context'], error?: unknown): void => log('error', message, ctx, error),
    /**
     * Timer de performance para medir duração de operações.
     *
     * @example
     * ```ts
     * const timer = log.time('fetchData');
     * await fetchData();
     * timer.end('dados carregados', { count: 42 });
     * ```
     */
    time: (label: string) => {
      const start = isBrowser ? performance.now() : Date.now();
      return {
        end: (message?: string, ctx?: LogEntry['context']): void => {
          const duration = Math.round((isBrowser ? performance.now() : Date.now()) - start);
          log('info', message || `${label} completed`, { ...ctx, duration });
        },
      };
    },
  };
}

// ─── Funções públicas de acesso ao storage ──────────────────────────

/**
 * Recupera todos os logs armazenados no localStorage.
 * Retorna array vazio no server ou em caso de falha.
 */
function getStoredLogs(): LogEntry[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(LOG_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Remove todos os logs armazenados e reseta flags de warning.
 */
function clearStoredLogs(): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(LOG_DB_KEY);
    localStorage.removeItem(STORAGE_LIMIT_WARNED_KEY);
  } catch {
    // Falha silenciosa
  }
}

// ─── Instância padrão ──────────────────────────────────────────────

/** Logger padrão da aplicação (sem prefixo de componente) */
const appLogger = createLogger();

// ─── Exports ────────────────────────────────────────────────────────

export type { LogLevel, LogEntry };
export { createLogger, getStoredLogs, clearStoredLogs };
export default appLogger;
