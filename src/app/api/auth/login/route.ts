import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await db.users.findByEmail(email);
    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const { passwordHash: _, ...safeUser } = user;

    // Create session token
    const token = Buffer.from(JSON.stringify({ userId: safeUser.id, email: safeUser.email, role: safeUser.role, time: Date.now() })).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: safeUser,
      token,
    });

    response.cookies.set('waveron_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Login failed', message: err.message }, { status: 500 });
  }
}
