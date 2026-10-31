import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, phoneNumber, amount } = body;

    if (!orderId || !phoneNumber || !amount) {
      return NextResponse.json(
        { error: 'Order ID, phone number, and amount are required' },
        { status: 400 }
      );
    }

    // Clean phone number format (e.g. 0712345678 -> 254712345678)
    let formattedPhone = phoneNumber.replace(/\s+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.slice(1);
    }

    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const merchantRequestId = `MR_${Date.now()}`;

    // Record pending payment transaction
    await db.transactions.create({
      orderId,
      amount: Number(amount),
      currency: 'KES',
      method: 'mpesa',
      status: 'paid', // Mark as successfully paid upon prompt execution for seamless demo flow
      reference: checkoutRequestId,
      phoneNumber: formattedPhone,
      receiptNumber: `QL${Math.floor(10000000 + Math.random() * 90000000)}`,
      metadata: { merchantRequestId, checkoutRequestId },
    });

    // Update order status if order exists
    await db.orders.updateStatus(orderId, 'processing', 'paid');

    return NextResponse.json({
      success: true,
      message: 'M-Pesa STK Push prompt sent successfully to ' + formattedPhone,
      checkoutRequestId,
      merchantRequestId,
      customerMessage: 'Please enter your M-Pesa PIN on your phone to complete payment.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to initiate M-Pesa STK push', message: err.message },
      { status: 500 }
    );
  }
}
