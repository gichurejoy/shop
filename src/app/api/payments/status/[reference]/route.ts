import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;
    const tx = await db.transactions.getByReference(reference);
    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json(tx);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch transaction', message: err.message }, { status: 500 });
  }
}
