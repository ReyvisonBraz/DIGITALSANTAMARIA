import { NextRequest, NextResponse } from 'next/server';

const SENTRY_HOST = 'o4504564.sentry.io';
const SENTRY_PATH_PREFIX = '/api/';

export async function POST(request: NextRequest) {
  try {
    const envelope = await request.text();
    const piece = envelope.split('\n')[0];
    const header = JSON.parse(piece);

    const dsn = new URL(header.dsn);

    if (dsn.hostname !== SENTRY_HOST) {
      return NextResponse.json({ error: 'Invalid Sentry host' }, { status: 400 });
    }

    const projectId = dsn.pathname.replace(SENTRY_PATH_PREFIX, '');
    const sentryUrl = `https://${SENTRY_HOST}${SENTRY_PATH_PREFIX}${projectId}/envelope/`;

    const response = await fetch(sentryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
      },
      body: envelope,
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error) {
    console.error('[Sentry Tunnel] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
