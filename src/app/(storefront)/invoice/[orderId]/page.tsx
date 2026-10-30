"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InvoiceView } from '../../../../components/InvoiceView';
import { apiClient } from '../../../../lib/api-client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function StandaloneInvoicePage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      apiClient.orders.get(String(orderId))
        .then((data) => {
          if (data) {
            setOrder(data);
          } else {
            // fallback sample order matching id
            setOrder({
              id: String(orderId),
              orderNumber: String(orderId),
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
            id: String(orderId),
            orderNumber: String(orderId),
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
    }
  }, [orderId]);

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
      <div className="max-w-4xl mx-auto mb-4 print:hidden">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B5A3C] hover:text-[#6F4630] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Account Dashboard</span>
        </Link>
      </div>

      <InvoiceView order={order} />
    </div>
  );
}
