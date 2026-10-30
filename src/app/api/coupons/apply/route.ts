import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, discountAmount: 0, message: 'Promo code is required.' }, { status: 400 });
    }

    const result = db.coupons.validate(code, Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ valid: false, discountAmount: 0, message: err.message }, { status: 500 });
  }
}
