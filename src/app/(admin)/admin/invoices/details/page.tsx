'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function InvoiceDetailsRedirect() {
  const router = useRouter();

  useEffect(() => {
    apiClient.orders.list({ limit: 1 })
      .then((res) => {
        if (res.orders && res.orders.length > 0) {
          router.replace(`/admin/invoices/${res.orders[0].id}`);
        } else {
          router.replace('/admin/invoices');
        }
      })
      .catch(() => {
        router.replace('/admin/invoices');
      });
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading invoice...</span>
      </div>
    </div>
  );
}
