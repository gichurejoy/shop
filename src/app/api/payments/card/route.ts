import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, cardNumber, cardHolder, expiryMonth, expiryYear, cvv } = body;

    if (!orderId || !amount) {
      return NextResponse.json({ error: 'Order ID and amount are required' }, { status: 400 });
    }

    const txId = `ch_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const authCode = `AUTH_${Math.floor(100000 + Math.random() * 900000)}`;

    db.transactions.create({
      orderId,
      amount: Number(amount),
      currency: 'USD',
      method: 'card',
      status: 'paid',
      reference: txId,
      receiptNumber: authCode,
      metadata: {
        cardLast4: cardNumber ? cardNumber.slice(-4) : '4242',
        cardHolder: cardHolder || 'Customer',
        authCode,
      },
    });

    // Update order status
    db.orders.updateStatus(orderId, 'processing', 'paid');

    return NextResponse.json({
      success: true,
      message: 'Card payment processed successfully',
      transactionId: txId,
      authCode,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Payment failed', message: err.message }, { status: 500 });
  }
}
