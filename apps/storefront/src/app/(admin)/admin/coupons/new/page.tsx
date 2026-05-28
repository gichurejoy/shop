'use client';

import Link from 'next/link';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', color: '#0f172a',
};

export default function CouponsAddPage() {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
          <Link href="/admin/coupons" style={{ color: '#64748b', textDecoration: 'none' }}>Coupons</Link> › <span style={{ color: '#ff6c2f' }}>Add</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Add Coupon</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Coupon Details</div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Coupon Code *</label>
              <input type="text" placeholder="e.g. SUMMER24" style={inputStyle} />
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Customers will enter this code at checkout.</p>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Description</label>
              <textarea rows={3} placeholder="Internal description..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Discount Type</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option>Percentage (%)</option>
                  <option>Fixed Amount ($)</option>
                  <option>Free Shipping</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Discount Value</label>
                <input type="number" placeholder="0" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Usage Limit</label>
                <input type="number" placeholder="Leave blank for unlimited" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Expiry Date</label>
                <input type="date" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button style={{ flex: 1, padding: '11px', borderRadius: '8px', background: '#ff6c2f', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Create Coupon</button>
              <Link href="/admin/coupons" style={{ padding: '11px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center' }}>Cancel</Link>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Options</div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#ff6c2f', width: '16px', height: '16px' }} />
              Active
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: '#ff6c2f', width: '16px', height: '16px' }} />
              Apply to specific products
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: '#ff6c2f', width: '16px', height: '16px' }} />
              One use per customer
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
