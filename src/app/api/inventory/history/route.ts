import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const logs = await (db.inventoryLogs as any).getAll();
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = await (db.inventoryLogs as any).log({
      product: body.product,
      type: body.type || 'Manual Adjustment',
      typeClass: body.typeClass || 'bg-primary-subtle text-primary',
      qty: body.qty,
      stock: body.stock,
      user: body.user || 'Admin',
      ref: body.ref || 'Manual inventory update',
    });
    return NextResponse.json({ entry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log inventory change' }, { status: 500 });
  }
}

