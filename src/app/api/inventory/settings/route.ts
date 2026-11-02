import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_SETTINGS = {
  outOfStockBehavior: 'show_unavailable', // 'hide' | 'show_unavailable' | 'allow_backorders'
  lowStockThreshold: 5,
  notifyOnLowStock: true,
  notifyEmail: 'logistics@waveron.com',
  barcodeFormat: 'Code-128',
  autoGenerateBarcodes: true,
  reserveStockOnCheckout: true,
};

export async function GET() {
  try {
    const row = await prisma.cmsSetting.findUnique({
      where: { key: 'store_inventory_settings' },
    });
    if (row && typeof row.value === 'object' && row.value !== null) {
      return NextResponse.json({ settings: { ...DEFAULT_SETTINGS, ...(row.value as object) } });
    }
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  } catch (error) {
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await prisma.cmsSetting.findUnique({
      where: { key: 'store_inventory_settings' },
    });

    const merged = {
      ...DEFAULT_SETTINGS,
      ...(current?.value as object || {}),
      ...body,
    };

    const saved = await prisma.cmsSetting.upsert({
      where: { key: 'store_inventory_settings' },
      update: { value: merged },
      create: { key: 'store_inventory_settings', value: merged },
    });

    return NextResponse.json({ success: true, settings: saved.value });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update inventory settings' }, { status: 500 });
  }
}

