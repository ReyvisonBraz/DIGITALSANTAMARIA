jest.mock('jose', () => ({
  jwtVerify: jest.fn().mockResolvedValue({ payload: { sub: 'user-1', exp: 9999999999 } }),
}));

jest.mock('@/lib/gemini/gemini', () => ({
  classifyReport: jest.fn().mockResolvedValue('infrastructure'),
}));

jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn().mockResolvedValue({ limited: false, headers: {} }),
}));

jest.mock('@/lib/api-auth', () => ({
  getAuthUserId: jest.fn().mockResolvedValue('user-1'),
}));

jest.mock('@/lib/logger', () => ({
  createLogger: jest.fn(() => ({ info: jest.fn(), error: jest.fn(), warn: jest.fn() })),
}));

import { POST } from '@/app/api/classify-report/route';
import { NextRequest } from 'next/server';

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/classify-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/classify-report', () => {
  it('returns 401 when user is not authenticated', async () => {
    const { getAuthUserId } = await import('@/lib/api-auth');
    (getAuthUserId as jest.Mock).mockResolvedValueOnce(null);

    const request = createRequest({ title: 'Test', description: 'Test description' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Autenticação necessária.');
  });

  it('returns 429 when rate limited', async () => {
    const { checkRateLimit } = await import('@/lib/rate-limit');
    (checkRateLimit as jest.Mock).mockResolvedValueOnce({ limited: true, headers: {} });

    const request = createRequest({ title: 'Test', description: 'Test description' });
    const response = await POST(request);

    expect(response.status).toBe(429);
  });

  it('returns 400 when title or description is missing', async () => {
    const request = createRequest({ title: 'Test' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('title e description obrigatórios');
  });

  it('classifies a report successfully', async () => {
    const request = createRequest({ title: 'Buraco na rua', description: 'Existe um buraco na via principal.' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.type).toBe('infrastructure');
  });

  it('returns 503 when classification fails', async () => {
    const { classifyReport } = await import('@/lib/gemini/gemini');
    (classifyReport as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    const request = createRequest({ title: 'Test', description: 'Test description' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.type).toBe('other');
    expect(data.degraded).toBe(true);
  });
});
