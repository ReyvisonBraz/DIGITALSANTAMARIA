import { NextRequest, NextResponse } from 'next/server';
import { classifyReport } from '@/lib/gemini/gemini';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAuthUserId } from '@/lib/api-auth';
import { createLogger } from '@/lib/logger';

const log = createLogger('ClassifyReportAPI');

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (!(await getAuthUserId(request))) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }

  const { limited, headers } = await checkRateLimit(ip);
  if (limited) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em instantes.' },
      { status: 429, headers },
    );
  }

  try {
    const { title, description } = await request.json();
    if (!title || !description) {
      return NextResponse.json({ error: 'title e description obrigatórios' }, { status: 400 });
    }

    const type = await classifyReport(String(title), String(description));
    return NextResponse.json({ type }, { headers });
  } catch (error) {
    log.error('Falha ao classificar relato', {}, error);
    return NextResponse.json({ type: 'other', degraded: true }, { status: 503 });
  }
}
