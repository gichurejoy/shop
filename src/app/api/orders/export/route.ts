import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { orders } = await db.orders.getAll({ limit: 2000 });
    const headers = ['Order Number', 'Date', 'Customer Name', 'Customer Email', 'Items Count', 'Subtotal', 'Tax', 'Shipping', 'Total', 'Status', 'Payment Status', 'Payment Method'];
    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.createdAt}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
      o.items?.length || 0,
      o.subtotal,
      o.tax,
      o.shippingFee,
      o.total,
      `"${o.status}"`,
      `"${o.paymentStatus}"`,
      `"${o.paymentMethod}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="orders_export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export orders' }, { status: 500 });
  }
}

