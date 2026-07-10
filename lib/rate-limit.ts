/**
 * Rate limiter com Upstash Redis para ambientes serverless (Vercel).
 * Fallback in-memory para desenvolvimento local.
 *
 * Upstash Redis é serverless-friendly: sem conexões persistentes,
 * funciona em edge functions, e cobra apenas por comandos executados.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const RATE_LIMIT_WINDOW = '1 m';
const MAX_REQUESTS_PER_WINDOW = 30;

// ─── Upstash Redis (produção) ───────────────────────────────────────

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const useUpstash = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

const ratelimit = useUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW),
      analytics: true,
      prefix: 'conecta:ratelimit',
    })
  : null;

// ─── In-memory fallback (dev local) ────────────────────────────────

const WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

function cleanup(ip: string): number[] {
  const now = Date.now();
  const log = requestLog.get(ip) || [];
  while (log.length > 0 && log[0] < now - WINDOW_MS) {
    log.shift();
  }
  requestLog.set(ip, log);
  return log;
}

function inMemoryIsRateLimited(ip: string): boolean {
  const log = cleanup(ip);
  if (log.length >= MAX_REQUESTS_PER_WINDOW) return true;
  log.push(Date.now());
  return false;
}

function inMemoryGetHeaders(ip: string): Record<string, string> {
  const log = cleanup(ip);
  return {
    'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
    'X-RateLimit-Remaining': String(Math.max(0, MAX_REQUESTS_PER_WINDOW - log.length)),
    'X-RateLimit-Reset': String(Math.ceil((Date.now() + WINDOW_MS) / 1000)),
  };
}

// ─── API pública ────────────────────────────────────────────────────

export interface RateLimitResult {
  limited: boolean;
  headers: Record<string, string>;
}

/**
 * Verifica se o IP excedeu o limite de requisições.
 * Em produção: usa Upstash Redis (sliding window preciso).
 * Em dev: usa Map in-memory (suficiente para um desenvolvedor).
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (useUpstash && ratelimit) {
    const result = await ratelimit.limit(ip);
    return {
      limited: !result.success,
      headers: {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
      },
    };
  }

  return {
    limited: inMemoryIsRateLimited(ip),
    headers: inMemoryGetHeaders(ip),
  };
}

/**
 * Versão síncrona para compatibilidade com código existente.
 * Em produção, prefira checkRateLimit() que é async e preciso.
 */
export function isRateLimited(ip: string): boolean {
  if (useUpstash && ratelimit) {
    // Em serverless, não podemos bloquear — retornamos false e deixamos
    // a API route usar checkRateLimit() para verificação async precisa.
    // Esta função existe apenas para compatibilidade com código legado.
    return false;
  }
  return inMemoryIsRateLimited(ip);
}

/**
 * Retorna headers de rate limit para a resposta HTTP.
 * Em produção, prefira checkRateLimit() que retorna headers precisos do Redis.
 */
export function getRateLimitHeaders(ip: string): Record<string, string> {
  if (useUpstash && ratelimit) {
    // Headers genéricos — em produção, use checkRateLimit() para dados reais.
    return {
      'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
      'X-RateLimit-Remaining': 'unknown',
      'X-RateLimit-Reset': String(Math.ceil((Date.now() + WINDOW_MS) / 1000)),
    };
  }
  return inMemoryGetHeaders(ip);
}
