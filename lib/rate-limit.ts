/**
 * Rate limiter simples em memoria para API Routes do Next.js.
 * Baseado no padrao do /api/logs.
 */

const RATE_LIMIT_WINDOW = 60_000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 30; // max 30 req/min por IP

const requestLog = new Map<string, number[]>();

function cleanup(ip: string) {
  const now = Date.now();
  const log = requestLog.get(ip) || [];
  while (log.length > 0 && log[0] < now - RATE_LIMIT_WINDOW) {
    log.shift();
  }
  requestLog.set(ip, log);
  return log;
}

export function isRateLimited(ip: string): boolean {
  const log = cleanup(ip);
  if (log.length >= MAX_REQUESTS_PER_WINDOW) return true;
  log.push(Date.now());
  return false;
}

export function getRateLimitHeaders(ip: string): Record<string, string> {
  const log = cleanup(ip);
  return {
    'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
    'X-RateLimit-Remaining': String(Math.max(0, MAX_REQUESTS_PER_WINDOW - log.length)),
    'X-RateLimit-Reset': String(Math.ceil((Date.now() + RATE_LIMIT_WINDOW) / 1000)),
  };
}
