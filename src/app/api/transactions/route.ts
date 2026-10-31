import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const transactions = await (db.transactions as any).getAll({ search, status });
    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await db.transactions.create({
      orderId: body.orderId || `ORD-${Date.now()}`,
      amount: Number(body.amount) || 0,
      currency: body.currency || 'USD',
      method: body.method || 'card',
      status: body.status || 'paid',
      reference: body.reference || `MANUAL-${Date.now()}`,
      phoneNumber: body.phoneNumber || null,
      receiptNumber: body.receiptNumber || `REC-${Date.now().toString().slice(-6)}`,
      metadata: body.metadata || { recordedBy: 'Admin' },
    });
    return NextResponse.json({ transaction: created });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 });
  }
}

