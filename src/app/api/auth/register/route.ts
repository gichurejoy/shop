import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = db.users.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const safeUser = db.users.create({
      name,
      email,
      password,
      phone,
      role: 'customer',
    });

    const token = Buffer.from(JSON.stringify({ userId: safeUser.id, email: safeUser.email, role: safeUser.role, time: Date.now() })).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: safeUser,
      token,
    }, { status: 201 });

    response.cookies.set('waveron_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Registration failed', message: err.message }, { status: 500 });
  }
}
