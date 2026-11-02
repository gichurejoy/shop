import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isExport = searchParams.get('export') === 'csv';

    const data = await (db.reports as any).getInventory();

    if (isExport) {
      const headers = ['Product ID', 'SKU / Title', 'Category', 'Units in Stock', 'Selling Price ($)', 'Valuation ($)', 'Stock Status'];
      const rows = (data.products || []).map((p: any) => {
        const qty = p.stockQuantity ?? 0;
        const price = p.price ?? 0;
        const status = qty === 0 ? 'Out of Stock' : qty <= 5 ? 'Low Stock' : 'In Stock';
        return [
          `"${p.id}"`,
          `"${(p.title || '').replace(/"/g, '""')}"`,
          `"${(p.category || 'Atelier Collection').replace(/"/g, '""')}"`,
          qty,
          price.toFixed(2),
          (qty * price).toFixed(2),
          `"${status}"`,
        ];
      });

      const csv = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="inventory_valuation_report_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ report: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch inventory report' }, { status: 500 });
  }
}
