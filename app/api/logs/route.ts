import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_LOG_SIZE = 10000;

interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, unknown>;
  error?: { name?: string; message: string; stack?: string; code?: string };
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
  if (!(await getAuthUserId(request))) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { limited } = await checkRateLimit(ip);
  if (limited) {
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
      maxRequests: 30,
      windowMs: 60000,
    },
  });
}
