import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const attributes = await db.attributes.getAll();
    return NextResponse.json({ attributes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attributes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Attribute name is required' }, { status: 400 });
    }
    const saved = await db.attributes.save({
      id: body.id,
      name: body.name,
      slug: body.slug,
      type: body.type,
      terms: Array.isArray(body.terms) ? body.terms.filter(Boolean) : [],
    });
    return NextResponse.json({ attribute: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save attribute' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Attribute ID required' }, { status: 400 });
    }
    const success = await db.attributes.delete(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete attribute' }, { status: 500 });
  }
}

