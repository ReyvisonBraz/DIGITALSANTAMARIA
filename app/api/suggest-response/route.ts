import { NextRequest, NextResponse } from 'next/server';
import { suggestDemandResponse } from '@/lib/gemini/gemini';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAuthUserId } from '@/lib/api-auth';
import { isStaffUid } from '@/lib/firebase-admin';
import { createLogger } from '@/lib/logger';

const log = createLogger('SuggestResponseAPI');

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  const uid = await getAuthUserId(request);
  if (!uid) {
    return NextResponse.json({ suggestion: '' }, { status: 401 });
  }

  const staff = await isStaffUid(uid);
  if (!staff) {
    return NextResponse.json({ suggestion: '' }, { status: 403 });
  }

  const { limited, headers } = await checkRateLimit(ip);
  if (limited) {
    return NextResponse.json(
      { suggestion: '' },
      { status: 429, headers },
    );
  }

  try {
    const { type, subject, text } = await request.json();
    if (!type || !subject || !text) {
      return NextResponse.json({ suggestion: '' }, { status: 400 });
    }

    const suggestion = await suggestDemandResponse(String(type), String(subject), String(text));
    return NextResponse.json({ suggestion }, { headers });
  } catch (error) {
    log.error('Falha ao sugerir resposta', {}, error);
    return NextResponse.json({ suggestion: '', degraded: true }, { status: 503 });
  }
}
