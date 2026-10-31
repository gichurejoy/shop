import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET() {
  try {
    const stats = await db.stats.getOverview();
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch dashboard stats', message: err.message }, { status: 500 });
  }
}

