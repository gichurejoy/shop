import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const coupons = await db.coupons.getAll();
    return NextResponse.json({ coupons });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch coupons', message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.code || body.discountValue === undefined) {
      return NextResponse.json({ error: 'Coupon code and discount value are required' }, { status: 400 });
    }

    const created = await db.coupons.create({
      code: body.code,
      discountType: body.discountType || 'percentage',
      discountValue: Number(body.discountValue),
      minOrderAmount: body.minOrderAmount ? Number(body.minOrderAmount) : 0,
      expiresAt: body.expiresAt || undefined,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create coupon', message: err.message }, { status: 500 });
  }
}
