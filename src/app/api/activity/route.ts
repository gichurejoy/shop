import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const logs = await (db.activity as any).getAll();
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = await (db.activity as any).log({
      user: body.user || 'Admin',
      action: body.action,
      module: body.module || 'System',
      details: body.details,
      color: body.color,
      icon: body.icon,
    });
    return NextResponse.json({ entry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record activity log' }, { status: 500 });
  }
}

