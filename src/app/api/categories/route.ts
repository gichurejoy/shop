import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.categories.getAll();
    return NextResponse.json({ categories });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch categories', message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const created = await db.categories.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create category', message: err.message }, { status: 500 });
  }
}
