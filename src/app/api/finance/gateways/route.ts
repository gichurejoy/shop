import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_GATEWAYS = [
  {
    id: 'stripe',
    name: 'Stripe',
    icon: 'fa6-brands:stripe',
    iconColor: '#635bff',
    description: 'Accept credit cards, debit cards, and Apple/Google Pay directly on your store.',
    enabled: true,
    fields: [
      { key: 'pk', label: 'Publishable Key', type: 'text', value: 'pk_test_51Mz...' },
      { key: 'sk', label: 'Secret Key', type: 'password', value: 'sk_test_51Mz...' },
      { key: 'webhook', label: 'Webhook Secret', type: 'password', value: 'whsec_...' },
    ],
  },
  {
    id: 'paypal',
    name: 'PayPal Checkout',
    icon: 'fa6-brands:paypal',
    iconColor: '#003087',
    description: 'Let customers pay with their PayPal account balance or saved cards.',
    enabled: false,
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text', value: '' },
      { key: 'secret', label: 'Client Secret', type: 'password', value: '' },
      { key: 'mode', label: 'Environment', type: 'select', value: 'sandbox' },
    ],
  },
  {
    id: 'mpesa',
    name: 'M-Pesa Express',
    icon: 'solar:smartphone-bold-duotone',
    iconColor: '#22c55e',
    description: 'Enable STK push mobile money payments for customers in East Africa.',
    enabled: true,
    fields: [
      { key: 'consumerKey', label: 'Consumer Key', type: 'text', value: 'b29xZ...' },
      { key: 'consumerSecret', label: 'Consumer Secret', type: 'password', value: 'vK9L...' },
      { key: 'shortcode', label: 'Business Shortcode', type: 'text', value: '174379' },
      { key: 'passkey', label: 'Passkey', type: 'password', value: 'bfb27...' },
    ],
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    icon: 'solar:box-bold-duotone',
    iconColor: '#64748b',
    description: 'Allow customers to pay in cash when the delivery arrives.',
    enabled: true,
    fields: [
      { key: 'instructions', label: 'Instructions for Customer', type: 'text', value: 'Please have the exact amount ready.' },
    ],
  },
];

export async function GET() {
  try {
    const setting = await prisma.cmsSetting.findUnique({
      where: { key: 'store_payment_gateways' },
    });

    if (setting?.value) {
      const val = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
      return NextResponse.json({ gateways: val });
    }

    return NextResponse.json({ gateways: DEFAULT_GATEWAYS });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gateways } = body;

    await prisma.cmsSetting.upsert({
      where: { key: 'store_payment_gateways' },
      update: { value: JSON.stringify(gateways) },
      create: { key: 'store_payment_gateways', value: JSON.stringify(gateways) },
    });

    return NextResponse.json({ success: true, gateways });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
