import { NextRequest, NextResponse } from 'next/server';
import { suggestDemandResponse } from '@/lib/gemini/gemini';

export async function POST(request: NextRequest) {
  try {
    const { type, subject, text } = await request.json();
    if (!type || !subject || !text) {
      return NextResponse.json({ suggestion: '' });
    }

    const suggestion = await suggestDemandResponse(String(type), String(subject), String(text));
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('[/api/suggest-response]', error);
    return NextResponse.json({ suggestion: '' });
  }
}
