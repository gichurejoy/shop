import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity, notes } = await req.json();
    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Valid productId and positive quantity required' }, { status: 400 });
    }

    const product = await db.products.getByIdOrSlug(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const currentStock = (product as any).stock_quantity ?? (product as any).stockQuantity ?? 0;
    const newStock = currentStock + Number(quantity);

    // Update in MySQL
    try {
      await prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: newStock },
      });
    } catch {
      await db.products.update(productId, { stock_quantity: newStock });
    }

    // Log to inventory history
    await (db.inventoryLogs as any).log({
      product: product.title,
      type: 'Stock Received',
      typeClass: 'bg-success-subtle text-success',
      qty: `+${quantity}`,
      stock: newStock,
      user: 'Inventory Manager',
      ref: notes || `Shipment intake PO-${Date.now().toString().slice(-5)}`,
    });

    // Log to system activity
    await (db.activity as any).log({
      user: 'Inventory Manager',
      action: `Restocked ${product.title} (+${quantity} units)`,
      module: 'Inventory',
      color: 'success',
      icon: 'solar:box-bold-duotone',
      details: `New vault stock level: ${newStock}. ${notes || ''}`,
    });

    return NextResponse.json({ success: true, product: { ...product, stockQuantity: newStock } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to receive stock' }, { status: 500 });
  }
}

