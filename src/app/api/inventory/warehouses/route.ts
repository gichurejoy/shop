import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const warehouses = await (db.warehouses as any).getAll();
    return NextResponse.json({ warehouses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch warehouses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.loc) {
      return NextResponse.json({ error: 'Warehouse name and location are required' }, { status: 400 });
    }
    const saved = await (db.warehouses as any).save(body);
    return NextResponse.json({ warehouse: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save warehouse' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Warehouse ID is required' }, { status: 400 });
    }
    const success = await (db.warehouses as any).delete(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete warehouse' }, { status: 500 });
  }
}
