import { NextRequest, NextResponse } from 'next/server';
import { classifyReport } from '@/lib/gemini/gemini';
import { isRateLimited, getRateLimitHeaders } from '@/lib/rate-limit';
import { getAuthUserId } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (!getAuthUserId(request)) {
    return NextResponse.json({ error: 'Autenticacao necessaria.' }, { status: 401 });
  }

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em instantes.' },
      { status: 429, headers: getRateLimitHeaders(ip) },
    );
  }

  try {
    const { title, description } = await request.json();
    if (!title || !description) {
      return NextResponse.json({ error: 'title e description obrigatorios' }, { status: 400 });
    }

    const type = await classifyReport(String(title), String(description));
    return NextResponse.json({ type }, { headers: getRateLimitHeaders(ip) });
  } catch (error) {
    console.error('[/api/classify-report]', error);
    return NextResponse.json({ type: 'other' });
  }
}
