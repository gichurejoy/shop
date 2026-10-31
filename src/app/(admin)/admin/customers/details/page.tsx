'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function CustomerDetailsDefaultPage() {
  const router = useRouter();

  useEffect(() => {
    apiClient.customers.list()
      .then((res) => {
        if (res.customers && res.customers.length > 0) {
          router.replace(`/admin/customers/${res.customers[0].id}`);
        } else {
          router.replace('/admin/customers');
        }
      })
      .catch(() => {
        router.replace('/admin/customers');
      });
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading customer details...</span>
      </div>
    </div>
  );
}
