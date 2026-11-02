import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_PAYOUTS = [
  { id: 'PAY-8821', vendor: 'Atelier Gold Foundry', balance: 4250.00, status: 'Pending', lastPayoutDate: 'Oct 01, 2026', bankInfo: 'Chase **** 4421' },
  { id: 'PAY-8822', vendor: 'Gemstone Lapidary Hub', balance: 2100.50, status: 'Processing', lastPayoutDate: 'Oct 05, 2026', bankInfo: 'Wells Fargo **** 1120' },
  { id: 'PAY-8823', vendor: 'Diamond Guild Paris', balance: 850.00, status: 'Paid', lastPayoutDate: 'Today', bankInfo: 'Citi **** 9088' },
  { id: 'PAY-8824', vendor: 'Silver Craft Workshop', balance: 1400.00, status: 'Pending', lastPayoutDate: 'Sep 15, 2026', bankInfo: 'Bank of America **** 5566' },
];

export async function GET() {
  try {
    const setting = await prisma.cmsSetting.findUnique({
      where: { key: 'store_payout_records' },
    });

    if (setting?.value) {
      const val = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
      return NextResponse.json({ payouts: val });
    }

    return NextResponse.json({ payouts: DEFAULT_PAYOUTS });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payouts } = body;

    await prisma.cmsSetting.upsert({
      where: { key: 'store_payout_records' },
      update: { value: JSON.stringify(payouts) },
      create: { key: 'store_payout_records', value: JSON.stringify(payouts) },
    });

    return NextResponse.json({ success: true, payouts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
