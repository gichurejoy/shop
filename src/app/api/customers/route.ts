import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const customers = await db.customers.getAll();
    return NextResponse.json({ customers });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch customers', message: err.message }, { status: 500 });
  }
}

