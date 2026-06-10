import { isRateLimited, getRateLimitHeaders } from '@/lib/rate-limit';

// Rate limiter uses in-memory Map; each test gets the same instance.
// We test the function logic, not accumulation across tests.

describe('Rate Limiter', () => {
  describe('isRateLimited', () => {
    it('should allow requests within the limit', () => {
      // First request from a new IP should not be rate limited
      const ip = `test-${Date.now()}-${Math.random()}`;
      const result = isRateLimited(ip);
      expect(result).toBe(false);
    });

    it('should block requests exceeding the limit (30)', () => {
      const ip = `test-${Date.now()}-${Math.random()}`;
      // Fire 30 requests
      for (let i = 0; i < 30; i++) {
        expect(isRateLimited(ip)).toBe(false);
      }
      // 31st should be blocked
      expect(isRateLimited(ip)).toBe(true);
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

  describe('getRateLimitHeaders', () => {
    it('should return correct header structure', () => {
      const ip = `test-${Date.now()}-${Math.random()}`;
      const headers = getRateLimitHeaders(ip);

      expect(headers).toHaveProperty('X-RateLimit-Limit');
      expect(headers).toHaveProperty('X-RateLimit-Remaining');
      expect(headers).toHaveProperty('X-RateLimit-Reset');

      expect(Number(headers['X-RateLimit-Limit'])).toBe(30);
      expect(Number(headers['X-RateLimit-Remaining'])).toBeGreaterThanOrEqual(0);
    });

    it('should show decreasing remaining count after requests', () => {
      const ip = `test-${Date.now()}-${Math.random()}`;

      const before = getRateLimitHeaders(ip);
      expect(Number(before['X-RateLimit-Remaining'])).toBe(30);

      isRateLimited(ip);

      const after = getRateLimitHeaders(ip);
      expect(Number(after['X-RateLimit-Remaining'])).toBe(29);
    });
  });
});
