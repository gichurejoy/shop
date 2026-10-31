import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { products } = await db.products.getAll({ limit: 1000 });
    const headers = ['ID', 'Title', 'SKU', 'Price', 'Stock', 'Category', 'Status', 'CreatedAt'];
    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${p.sku || ''}"`,
      p.price,
      p.stockQuantity,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      `"${p.status}"`,
      `"${p.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="products_export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export products' }, { status: 500 });
  }
}

