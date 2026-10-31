import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = await db.settings.get();
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch settings', message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await db.settings.update(body);
    return NextResponse.json({ settings: updated, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to save settings', message: err.message }, { status: 500 });
  }
}

