import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/api-auth';

const MAX_LOG_SIZE = 10000;
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_WINDOW = 100;

interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, unknown>;
  error?: { name?: string; message: string; stack?: string; code?: string };
}

const requestLog: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  while (requestLog.length > 0 && requestLog[0] < now - RATE_LIMIT_WINDOW) {
    requestLog.shift();
  }
  if (requestLog.length >= MAX_REQUESTS_PER_WINDOW) return true;
  requestLog.push(now);
  return false;
}

function formatLogEntry(entry: LogEntry): string {
  const parts = [
    `[${entry.timestamp}]`,
    `[${entry.level.toUpperCase()}]`,
    entry.message,
  ];

  if (entry.context && Object.keys(entry.context).length > 0) {
    parts.push(`| ctx: ${JSON.stringify(entry.context)}`);
  }

  if (entry.error) {
    parts.push(`| error: ${entry.error.message}`);
    if (entry.error.stack) {
      const stackLines = entry.error.stack.split('\n').slice(0, 5).join(' | ');
      parts.push(`| stack: ${stackLines}`);
    }
  }

  return parts.join(' ');
}

export async function POST(request: NextRequest) {
  if (!getAuthUserId(request)) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }

  if (isRateLimited()) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const text = await request.text();
    if (text.length > MAX_LOG_SIZE) {
      return NextResponse.json({ error: 'Log entry too large' }, { status: 413 });
    }

    const entry: LogEntry = JSON.parse(text);

    if (!entry.timestamp || !entry.level || !entry.message) {
      return NextResponse.json({ error: 'Invalid log entry' }, { status: 400 });
    }

    const formatted = formatLogEntry(entry);

    switch (entry.level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'info':
        console.log(formatted);
        break;
      case 'debug':
        console.debug(formatted);
        break;
      default:
        console.log(formatted);
    }

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (error) {
    console.error('[Logs API] Failed to process log:', error);
    return NextResponse.json({ error: 'Failed to process log' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoints: {
      POST: '/api/logs - Enviar logs',
    },
    rateLimit: {
      maxRequests: MAX_REQUESTS_PER_WINDOW,
      windowMs: RATE_LIMIT_WINDOW,
    },
  });
}
