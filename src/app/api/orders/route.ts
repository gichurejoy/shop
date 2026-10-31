import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { IOrder } from '../../../types/order';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const paymentStatus = searchParams.get('paymentStatus') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 50;

    const result = await db.orders.getAll({ status, paymentStatus, search, page, limit });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch orders', message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }
    if (!body.customerName || !body.customerEmail || !body.shippingAddress) {
      return NextResponse.json({ error: 'Customer name, email, and shipping address are required' }, { status: 400 });
    }

    // Server-side calculation of pricing
    const subtotal = body.items.reduce(
      (sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const shippingFee = body.shippingFee !== undefined ? Number(body.shippingFee) : (subtotal > 200 ? 0 : 9.99);
    const discount = Number(body.discount) || 0;
    const tax = Number(body.tax) || Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + shippingFee + tax - discount).toFixed(2));

    const orderPayload: Omit<IOrder, 'id' | 'orderNumber' | 'timeline' | 'createdAt' | 'updatedAt'> = {
      customerId: body.customerId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone || '',
      items: body.items.map((i: any, idx: number) => ({
        id: i.id || `item-${idx + 1}`,
        productId: String(i.productId || i.id),
        name: i.name,
        price: Number(i.price),
        quantity: Number(i.quantity) || 1,
        selectedSize: i.selectedSize,
        selectedColor: i.selectedColor,
        image: i.image || '',
      })),
      subtotal,
      tax,
      shippingFee,
      discount,
      couponCode: body.couponCode,
      total,
      status: body.status || 'pending',
      paymentStatus: body.paymentStatus || 'unpaid',
      paymentMethod: body.paymentMethod || 'card',
      shippingMethod: body.shippingMethod || 'standard',
      shippingAddress: body.shippingAddress,
      orderNotes: body.orderNotes,
      giftWrap: Boolean(body.giftWrap),
    };

    const createdOrder = await db.orders.create(orderPayload);
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create order', message: err.message }, { status: 500 });
  }
}
