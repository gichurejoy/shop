import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_TAX_SETTINGS = {
  calculation: 'inclusive',
  roundAtSubtotal: true,
  taxes: [
    { id: '1', region: 'California', country: 'United States', rate: '7.25%', digitalRate: '0.00%', status: true },
    { id: '2', region: 'New York', country: 'United States', rate: '4.00%', digitalRate: '4.00%', status: true },
    { id: '3', region: 'Texas', country: 'United States', rate: '6.25%', digitalRate: '6.25%', status: true },
    { id: '4', region: 'Ontario', country: 'Canada', rate: '13.00%', digitalRate: '13.00%', status: false },
    { id: '5', region: 'Nairobi', country: 'Kenya', rate: '16.00%', digitalRate: '16.00%', status: true },
  ],
};

export async function GET() {
  try {
    const setting = await prisma.cmsSetting.findUnique({
      where: { key: 'store_tax_settings' },
    });

    if (setting?.value) {
      const val = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
      return NextResponse.json(val);
    }

    return NextResponse.json(DEFAULT_TAX_SETTINGS);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await prisma.cmsSetting.upsert({
      where: { key: 'store_tax_settings' },
      update: { value: JSON.stringify(body) },
      create: { key: 'store_tax_settings', value: JSON.stringify(body) },
    });

    return NextResponse.json({ success: true, ...body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
