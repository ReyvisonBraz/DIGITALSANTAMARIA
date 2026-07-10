import { checkRateLimit, isRateLimited, getRateLimitHeaders } from '@/lib/rate-limit';

describe('Rate Limiter', () => {
  describe('isRateLimited (sync fallback)', () => {
    it('should allow first request from a new IP', () => {
      const ip = `test-${Date.now()}-${Math.random()}`;
      const result = isRateLimited(ip);
      expect(result).toBe(false);
    });

    it('should track different IPs independently', () => {
      const ip1 = `test-${Date.now()}-${Math.random()}-1`;
      const ip2 = `test-${Date.now()}-${Math.random()}-2`;

      // Exhaust ip1
      for (let i = 0; i < 30; i++) {
        isRateLimited(ip1);
      }
      expect(isRateLimited(ip1)).toBe(true);

      // ip2 should still be allowed
      expect(isRateLimited(ip2)).toBe(false);
    });
  });

  describe('getRateLimitHeaders (sync fallback)', () => {
    it('should return correct header structure', () => {
      const ip = `test-${Date.now()}-${Math.random()}`;
      const headers = getRateLimitHeaders(ip);

      expect(headers).toHaveProperty('X-RateLimit-Limit');
      expect(headers).toHaveProperty('X-RateLimit-Remaining');
      expect(headers).toHaveProperty('X-RateLimit-Reset');

      expect(Number(headers['X-RateLimit-Limit'])).toBe(30);
    });
  });

  describe('checkRateLimit (async)', () => {
    it('should return limited: false for first request', async () => {
      const ip = `async-test-${Date.now()}-${Math.random()}`;
      const result = await checkRateLimit(ip);

      expect(result).toHaveProperty('limited');
      expect(result).toHaveProperty('headers');
      expect(typeof result.limited).toBe('boolean');
      expect(result.headers).toHaveProperty('X-RateLimit-Limit');
      expect(result.headers).toHaveProperty('X-RateLimit-Remaining');
      expect(result.headers).toHaveProperty('X-RateLimit-Reset');
    });

    it('should return headers with numeric values', async () => {
      const ip = `async-test-${Date.now()}-${Math.random()}`;
      const result = await checkRateLimit(ip);

      expect(Number(result.headers['X-RateLimit-Limit'])).toBeGreaterThan(0);
      expect(Number(result.headers['X-RateLimit-Reset'])).toBeGreaterThan(0);
    });
  });
});
