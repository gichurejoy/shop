import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.productId || !body.fromWh || !body.toWh || !body.quantity) {
      return NextResponse.json({ error: 'Product, route, and quantity are required' }, { status: 400 });
    }
    const result = await (db.warehouses as any).transfer(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to execute stock transfer' }, { status: 500 });
  }
}

