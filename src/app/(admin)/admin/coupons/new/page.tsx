'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  color: '#0f172a',
};

export default function CouponsAddPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState<number | string>('');
  const [minOrderAmount, setMinOrderAmount] = useState<number | string>('');
  const [expiresAt, setExpiresAt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Coupon code is required');
      return;
    }
    if (!discountValue || Number(discountValue) <= 0) {
      toast.error('Please enter a valid discount value');
      return;
    }

    try {
      setSaving(true);
      await apiClient.coupons.create({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      });

      toast.success(`Coupon "${code.toUpperCase()}" created and active!`);
      router.push('/admin/coupons');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
          <Link href="/admin/coupons" style={{ color: '#64748b', textDecoration: 'none' }}>Coupons</Link> › <span style={{ color: '#ff6c2f' }}>Add</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Add New Coupon</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Coupon Details</div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. LUXURY20"
                style={inputStyle}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Customers will enter this uppercase promo code at checkout.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Discount Type</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Discount Value *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder={discountType === 'percentage' ? '20' : '50.00'}
                  style={inputStyle}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Min Order Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 100.00 (optional)"
                  style={inputStyle}
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Expiry Date</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button
                type="submit"
                disabled={saving}
                style={{ flex: 1, padding: '11px', borderRadius: '8px', background: '#ff6c2f', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
              >
                {saving ? 'Creating...' : 'Create Coupon'}
              </button>
              <Link href="/admin/coupons" style={{ padding: '11px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                Cancel
              </Link>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Preview &amp; Policy</div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="p-3 bg-light rounded text-center border">
              <span className="badge bg-primary fs-14 font-monospace">{code || 'COUPON_CODE'}</span>
              <h4 className="mt-2 mb-0 fw-bold text-dark">
                {discountValue ? (discountType === 'percentage' ? `${discountValue}% OFF` : `$${discountValue} OFF`) : '0% OFF'}
              </h4>
              <p className="text-muted fs-12 mb-0 mt-1">
                {minOrderAmount ? `Orders above $${minOrderAmount}` : 'No minimum order required'}
              </p>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked disabled style={{ accentColor: '#ff6c2f', width: '16px', height: '16px' }} />
              Active immediately
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked disabled style={{ accentColor: '#ff6c2f', width: '16px', height: '16px' }} />
              Persists to MySQL Database
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
