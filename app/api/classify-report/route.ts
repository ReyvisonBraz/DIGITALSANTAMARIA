import { NextRequest, NextResponse } from 'next/server';
import { classifyReport } from '@/lib/gemini/gemini';

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();
    if (!title || !description) {
      return NextResponse.json({ error: 'title e description obrigatorios' }, { status: 400 });
    }

    const type = await classifyReport(String(title), String(description));
    return NextResponse.json({ type });
  } catch (error) {
    console.error('[/api/classify-report]', error);
    return NextResponse.json({ type: 'other' });
  }
}
