import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const staff = await db.staff.getAll();
    return NextResponse.json({ staff });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff members' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json({ error: 'Name, email, and role are required' }, { status: 400 });
    }
    const member = await db.staff.create({
      name: body.name,
      email: body.email,
      role: body.role,
      phone: body.phone,
    });
    return NextResponse.json({ member });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Staff ID required' }, { status: 400 });
    }
    const success = await db.staff.delete(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
  }
}

