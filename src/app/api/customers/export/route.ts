import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const customers = await db.customers.getAll();
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Tier', 'Joined Date'];
    const rows = customers.map((c: any) => [
      `"${c.id}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      c.totalOrders || 0,
      c.totalSpent || 0,
      `"${c.tier || 'Silver'}"`,
      `"${c.createdAt || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="customers_export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export customers' }, { status: 500 });
  }
}

