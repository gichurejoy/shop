import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'this_month';
    const isExport = searchParams.get('export') === 'csv';

    const data = await (db.reports as any).getFinancial(range);

    if (isExport) {
      const headers = ['Order ID', 'Date', 'Customer', 'Subtotal', 'Discounts', 'Tax', 'Shipping', 'Total', 'Payment Status', 'Fulfillment Status'];
      const rows = (data.orders || []).map((o: any) => [
        `"${o.orderNumber || o.id}"`,
        `"${new Date(o.createdAt).toLocaleDateString()}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        (o.subtotal || 0).toFixed(2),
        (o.discount || 0).toFixed(2),
        (o.tax || 0).toFixed(2),
        (o.shippingFee || 0).toFixed(2),
        (o.total || 0).toFixed(2),
        `"${o.paymentStatus || 'paid'}"`,
        `"${o.status || 'completed'}"`,
      ]);

      const csv = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="financial_report_${range}_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ report: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch financial report' }, { status: 500 });
  }
}

