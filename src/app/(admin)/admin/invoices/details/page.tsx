'use client';

import Link from 'next/link';

const ITEMS = [
  { name: 'Men Black Slim Fit T-shirt', qty: 2, price: 80, total: 160 },
  { name: 'Olive Green Leather Bag', qty: 1, price: 136, total: 136 },
  { name: 'Gray Cap For Men', qty: 1, price: 76, total: 76 },
];
const subtotal = ITEMS.reduce((s, i) => s + i.total, 0);
const tax = Math.round(subtotal * 0.1);
const total = subtotal + 15 + tax;

export default function InvoiceDetailPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
            <Link href="/admin/invoices" style={{ color: '#64748b', textDecoration: 'none' }}>Invoices</Link> › <span style={{ color: '#ff6c2f' }}>INV-2401</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Invoice INV-2401</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <iconify-icon icon="solar:printer-bold-duotone" /> Print
          </button>
          <button style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <iconify-icon icon="solar:download-bold-duotone" /> Download
          </button>
          <button style={{ padding: '8px 16px', borderRadius: '8px', background: '#ff6c2f', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            Send Invoice
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', maxWidth: '860px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg,#ff6c2f,#ff8f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <iconify-icon icon="solar:shop-bold-duotone" style={{ color: '#fff', fontSize: '18px' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Larkon Store</span>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              123 Commerce Street<br />Chicago, IL 60601<br />United States<br />billing@larkon.store
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#ff6c2f', letterSpacing: '-1px' }}>INVOICE</div>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}># INV-2401</div>
            <div style={{ marginTop: '12px', padding: '4px 14px', borderRadius: '20px', background: '#dcfce7', color: '#16a34a', fontSize: '12px', fontWeight: 700, display: 'inline-block' }}>PAID</div>
          </div>
        </div>

        {/* Bill to / dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Bill To</div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '4px' }}>Anna M. Hines</div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              anna.hines@mail.com<br />123 Oak Street, Chicago, IL 60601<br />(+1) 555-1564-261
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Invoice Details</div>
            {[['Issue Date', '29 Apr 2024'], ['Due Date', '10 May 2024'], ['Payment', 'Credit Card'], ['Order Ref', '#RB5625']].map(([l, v]) => (
              <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>{l}</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '24px' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['#', 'Item', 'Qty', 'Unit Price', 'Total'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, i) => (
              <tr key={item.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px', color: '#94a3b8' }}>{i + 1}</td>
                <td style={{ padding: '14px', fontWeight: 600, color: '#0f172a' }}>{item.name}</td>
                <td style={{ padding: '14px', color: '#64748b' }}>{item.qty}</td>
                <td style={{ padding: '14px', color: '#64748b' }}>${item.price}</td>
                <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>${item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '260px' }}>
            {[['Subtotal', `$${subtotal}`], ['Shipping', '$15'], ['Tax (10%)', `$${tax}`]].map(([l, v]) => (
              <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#64748b' }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#0f172a', paddingTop: '12px', borderTop: '2px solid #e2e8f0' }}>
              <span>Total</span><span style={{ color: '#ff6c2f' }}>${total}</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
          Thank you for your business! Payment terms: Net 30. Questions? Email billing@larkon.store
        </div>
      </div>
    </div>
  );
}
