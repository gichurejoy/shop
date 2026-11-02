import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_FAQS: Record<string, { id: string; q: string; a: string }[]> = {
  General: [
    { id: 'faq-1', q: 'What is Waveron Atelier?', a: 'Waveron Atelier is an exclusive luxury e-commerce platform curating bespoke fine jewelry, luxury accessories, and handcrafted lifestyle essentials.' },
    { id: 'faq-2', q: 'Where are products crafted?', a: 'Each collection is master-crafted across our artisan partner studios in Paris, Milan, Nairobi, and Tokyo.' },
    { id: 'faq-3', q: 'Can I request bespoke sizing or custom engraving?', a: 'Yes. Concierge services offer personalized engravings and custom metal selection upon request during checkout.' },
  ],
  Orders: [
    { id: 'faq-4', q: 'How do I track my shipment?', a: 'Once your order is dispatched, a real-time tracking reference is emailed and visible under your order details page.' },
    { id: 'faq-5', q: 'What shipping options are offered?', a: 'We provide complimentary insured White-Glove Courier delivery across all domestic and international destinations.' },
    { id: 'faq-6', q: 'What is the return policy?', a: 'We offer a 14-day return privilege on unworn items with original security seals and documentation intact.' },
  ],
  Billing: [
    { id: 'faq-7', q: 'Which payment currencies are supported?', a: 'We process settlements in USD, EUR, GBP, and KES via certified payment rails including Stripe and M-Pesa.' },
    { id: 'faq-8', q: 'How can I obtain a corporate VAT invoice?', a: 'Official downloadable PDF invoices are generated immediately upon order confirmation in your account.' },
  ],
};

export async function GET() {
  try {
    const row = await prisma.cmsSetting.findUnique({
      where: { key: 'store_faqs' },
    });
    if (row && typeof row.value === 'object' && row.value !== null) {
      return NextResponse.json({ faqs: row.value });
    }
    return NextResponse.json({ faqs: DEFAULT_FAQS });
  } catch (error) {
    return NextResponse.json({ faqs: DEFAULT_FAQS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, faq, allFaqs } = body;

    let updatedFaqs = allFaqs;

    if (!updatedFaqs) {
      const current = await prisma.cmsSetting.findUnique({
        where: { key: 'store_faqs' },
      });
      const existing: Record<string, any[]> = (current?.value as any) || DEFAULT_FAQS;

      if (category && faq) {
        if (!existing[category]) existing[category] = [];
        const idx = existing[category].findIndex((item: any) => item.id === faq.id);
        if (idx !== -1) {
          existing[category][idx] = faq;
        } else {
          existing[category].push({ ...faq, id: faq.id || `faq-${Date.now()}` });
        }
      }
      updatedFaqs = existing;
    }

    await prisma.cmsSetting.upsert({
      where: { key: 'store_faqs' },
      update: { value: updatedFaqs },
      create: { key: 'store_faqs', value: updatedFaqs },
    });

    return NextResponse.json({ success: true, faqs: updatedFaqs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save FAQs' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    if (!category || !id) {
      return NextResponse.json({ error: 'Category and FAQ ID required' }, { status: 400 });
    }

    const current = await prisma.cmsSetting.findUnique({
      where: { key: 'store_faqs' },
    });
    const existing: Record<string, any[]> = (current?.value as any) || DEFAULT_FAQS;

    if (existing[category]) {
      existing[category] = existing[category].filter((f) => f.id !== id);
    }

    await prisma.cmsSetting.upsert({
      where: { key: 'store_faqs' },
      update: { value: existing },
      create: { key: 'store_faqs', value: existing },
    });

    return NextResponse.json({ success: true, faqs: existing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete FAQ' }, { status: 500 });
  }
}
