import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_FLOWS = [
  { id: 'f1', name: 'Welcome Email', trigger: 'User signs up', status: true, performance: '45% Open Rate' },
  { id: 'f2', name: 'Abandoned Cart', trigger: 'Cart left for 2 hours', status: true, performance: '12% Recovery Rate' },
  { id: 'f3', name: 'Post-purchase Follow up', trigger: '3 days after delivery', status: false, performance: '-' },
  { id: 'f4', name: 'Win-back (Inactive)', trigger: 'No purchase for 60 days', status: true, performance: '5% Win-back Rate' },
  { id: 'f5', name: 'Birthday Discount', trigger: 'On user birthday', status: false, performance: '-' },
];

const DEFAULT_TEMPLATES = [
  {
    id: 't1',
    name: 'Order Confirmation',
    type: 'Transactional',
    subject: 'Your Atelier Order is Confirmed — #{{order.number}}',
    lastUpdated: '2 days ago',
    content: '<h1>Thank you for your order, {{customer.first_name}}!</h1>\n<p>Your order #{{order.number}} totaling {{order.total}} has been received and confirmed.</p>\n<p>Our artisans are preparing your selection for secure white-glove dispatch.</p>',
  },
  {
    id: 't2',
    name: 'Order Shipped',
    type: 'Transactional',
    subject: 'Your Atelier Package Has Been Dispatched',
    lastUpdated: '1 week ago',
    content: '<h1>Your order is on the way!</h1>\n<p>Package #{{order.number}} is en route with tracking number: {{order.tracking_number}}.</p>',
  },
  {
    id: 't3',
    name: 'Refund Processed',
    type: 'Transactional',
    subject: 'Refund Confirmation — Order #{{order.number}}',
    lastUpdated: '1 month ago',
    content: '<h1>Refund Processed</h1>\n<p>Your refund of {{refund.amount}} has been issued to your original payment method.</p>',
  },
  {
    id: 't4',
    name: 'Password Reset',
    type: 'System',
    subject: 'Reset Your Atelier Password',
    lastUpdated: '3 months ago',
    content: '<h1>Password Reset Request</h1>\n<p>Click the link below to securely reset your credentials:</p>\n<p><a href="{{reset_url}}">Reset Password</a></p>',
  },
];

export async function GET() {
  try {
    const row = await prisma.cmsSetting.findUnique({
      where: { key: 'store_communications' },
    });
    if (row && typeof row.value === 'object' && row.value !== null) {
      const val = row.value as any;
      return NextResponse.json({
        flows: val.flows || DEFAULT_FLOWS,
        templates: val.templates || DEFAULT_TEMPLATES,
      });
    }
    return NextResponse.json({
      flows: DEFAULT_FLOWS,
      templates: DEFAULT_TEMPLATES,
    });
  } catch (error) {
    return NextResponse.json({
      flows: DEFAULT_FLOWS,
      templates: DEFAULT_TEMPLATES,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await prisma.cmsSetting.findUnique({
      where: { key: 'store_communications' },
    });
    const existing = (current?.value as any) || { flows: DEFAULT_FLOWS, templates: DEFAULT_TEMPLATES };

    let updatedFlows = existing.flows;
    let updatedTemplates = existing.templates;

    if (body.flows) {
      updatedFlows = body.flows;
    }
    if (body.template) {
      const idx = updatedTemplates.findIndex((t: any) => t.id === body.template.id);
      if (idx !== -1) {
        updatedTemplates[idx] = {
          ...updatedTemplates[idx],
          ...body.template,
          lastUpdated: 'Just now',
        };
      } else {
        updatedTemplates.push({
          ...body.template,
          lastUpdated: 'Just now',
        });
      }
    }

    const payload = { flows: updatedFlows, templates: updatedTemplates };

    await prisma.cmsSetting.upsert({
      where: { key: 'store_communications' },
      update: { value: payload },
      create: { key: 'store_communications', value: payload },
    });

    return NextResponse.json({ success: true, communications: payload });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update communications' }, { status: 500 });
  }
}

