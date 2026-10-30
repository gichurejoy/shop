"use client";

import React, { useEffect, useState } from 'react';
import { InvoiceView } from '../../../components/InvoiceView';
import { apiClient } from '../../../lib/api-client';
import { Loader2 } from 'lucide-react';

export default function DefaultInvoicePage() {
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.orders.list()
      .then((res) => {
        if (res.orders && res.orders.length > 0) {
          setOrder(res.orders[0]);
        } else {
          setOrder({
            id: 'LK-2024-58291',
            orderNumber: 'LK-2024-58291',
            createdAt: new Date().toISOString(),
            total: 322.92,
            subtotal: 299.00,
            tax: 23.92,
            status: 'paid',
            paymentStatus: 'paid',
            customerName: 'Sarah Johnson',
            customerEmail: 'customer@waveron.com',
            customerPhone: '+1 (555) 123-4567',
            shippingAddress: {
              name: 'Sarah Johnson',
              line1: '123 Maple Street',
              city: 'Portland',
              state: 'OR',
              zip: '97201',
              country: 'United States'
            },
            items: [
              {
                id: 'item-1',
                name: 'Classic Gold Band Ring',
                price: 299,
                quantity: 1,
                selectedSize: 'M',
                selectedColor: '18k Yellow Gold',
                sku: 'LK-JWL-001',
                image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'
              }
            ]
          });
        }
      })
      .catch(() => {
        setOrder({
          id: 'LK-2024-58291',
          orderNumber: 'LK-2024-58291',
          createdAt: new Date().toISOString(),
          total: 322.92,
          subtotal: 299.00,
          tax: 23.92,
          status: 'paid',
          paymentStatus: 'paid',
          customerName: 'Sarah Johnson',
          customerEmail: 'customer@waveron.com',
          customerPhone: '+1 (555) 123-4567',
          shippingAddress: {
            name: 'Sarah Johnson',
            line1: '123 Maple Street',
            city: 'Portland',
            state: 'OR',
            zip: '97201',
            country: 'United States'
          },
          items: [
            {
              id: 'item-1',
              name: 'Classic Gold Band Ring',
              price: 299,
              quantity: 1,
              selectedSize: 'M',
              selectedColor: '18k Yellow Gold',
              sku: 'LK-JWL-001',
              image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'
            }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B5A3C]" />
        <p className="text-sm font-medium text-gray-500">Preparing Atelier Invoice...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <InvoiceView order={order} />
    </div>
  );
}
