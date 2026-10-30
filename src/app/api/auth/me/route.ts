import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('waveron_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const payload = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf8'));
    if (!payload?.email) {
      return NextResponse.json({ user: null });
    }

    const user = db.users.findByEmail(payload.email);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch {
    return NextResponse.json({ user: null });
  }
}
