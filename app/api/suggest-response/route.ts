import { NextRequest, NextResponse } from 'next/server';
import { suggestDemandResponse } from '@/lib/gemini/gemini';
import { isRateLimited, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { suggestion: '' },
      { status: 429, headers: getRateLimitHeaders(ip) },
    );
  }

  try {
    const { type, subject, text } = await request.json();
    if (!type || !subject || !text) {
      return NextResponse.json({ suggestion: '' });
    }

    const suggestion = await suggestDemandResponse(String(type), String(subject), String(text));
    return NextResponse.json({ suggestion }, { headers: getRateLimitHeaders(ip) });
  } catch (error) {
    console.error('[/api/suggest-response]', error);
    return NextResponse.json({ suggestion: '' });
  }
}
