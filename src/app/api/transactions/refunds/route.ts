import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const transactions = await (db.transactions as any).getAll();
    const refunds = (transactions || []).filter((t: any) => t.status === 'Refunded' || t.status === 'refunded');
    return NextResponse.json({ refunds });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch refunds' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, amount, reason } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }
    const updated = await (db.transactions as any).refund(id, amount, reason);
    if (!updated) {
      return NextResponse.json({ error: 'Transaction not found or could not be refunded' }, { status: 404 });
    }
    // Also record an activity log
    await (db.activity as any).log({
      user: 'Admin',
      action: `Processed refund of $${amount || updated.amount} for TRX ${id}`,
      module: 'Finance',
      color: 'warning',
      icon: 'solar:wallet-money-bold-duotone',
      details: reason || 'Processed via Admin Portal',
    });

    return NextResponse.json({ success: true, transaction: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 });
  }
}

