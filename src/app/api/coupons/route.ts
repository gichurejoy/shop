import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const coupons = db.coupons.getAll();
    return NextResponse.json({ coupons });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch coupons', message: err.message }, { status: 500 });
  }
}
