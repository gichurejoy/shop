'use client';

import Link from 'next/link';

const ITEMS = [
  { name: 'Men Black Slim Fit T-shirt', size: 'M', qty: 2, price: 80, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png' },
  { name: 'Dark Green Cargo Pant',       size: 'M', qty: 1, price: 98, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-5.png' },
  { name: 'Men Dark Brown Wallet',       size: 'S', qty: 1, price: 72, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-8.png' },
  { name: "Kid's Yellow T-shirt",        size: 'S', qty: 3, price: 45, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-4.png' },
];

export default function InvoiceDetailsPage() {
  const subtotal = ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = 50;
  const tax = Math.round(subtotal * 0.155);
  const total = subtotal - discount + tax;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0">Invoice #INV1695</h4>
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Issue Date: 10 Aug, 2023 · Due: 24 Aug, 2023</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-light d-flex align-items-center gap-2" onClick={() => window.print()}>
            <iconify-icon icon="solar:printer-bold-duotone"></iconify-icon> Print
          </button>
          <Link href="/admin/invoices" className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <iconify-icon icon="solar:arrow-left-linear"></iconify-icon> Back
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {/* Header */}
          <div className="row align-items-center mb-4">
            <div className="col-sm-6 mb-3 mb-sm-0">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ff6c2f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <iconify-icon icon="solar:shop-bold-duotone" style={{ fontSize: '26px', color: '#fff' }}></iconify-icon>
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Larkon Admin.</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Premium Admin Dashboard</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 text-sm-end">
              <span className="badge bg-warning-subtle text-warning fs-13 px-3 py-2">Pending</span>
            </div>
          </div>

          <hr />

          {/* Addresses */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <iconify-icon icon="solar:buildings-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
                Issue From:
              </h6>
              <p className="fw-bold mb-1">Larkon Admin.INC</p>
              <p className="text-muted mb-1" style={{ fontSize: '13px' }}>2437 Romano Street Cambridge, MA 02141</p>
              <p className="text-muted mb-1" style={{ fontSize: '13px' }}>
                <iconify-icon icon="solar:phone-bold" className="me-1"></iconify-icon>+(31) 781-417-2004
              </p>
              <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                <iconify-icon icon="solar:letter-bold" className="me-1"></iconify-icon>admin@larkon.com
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <iconify-icon icon="solar:user-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
                Issue For:
              </h6>
              <p className="fw-bold mb-1">Gaston Lapierre</p>
              <p className="text-muted mb-1" style={{ fontSize: '13px' }}>1344 Hershell Hollow Road WA 98168, USA</p>
              <p className="text-muted mb-1" style={{ fontSize: '13px' }}>
                <iconify-icon icon="solar:phone-bold" className="me-1"></iconify-icon>+(123) 732-760-5760
              </p>
              <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                <iconify-icon icon="solar:letter-bold" className="me-1"></iconify-icon>hello@dundermuffilin.com
              </p>
            </div>
          </div>

          {/* Invoice meta */}
          <div className="row mb-4">
            {[
              { label: 'Invoice', value: '#INV1695' },
              { label: 'Issue Date', value: '10 Aug, 2023' },
              { label: 'Due Date', value: '24 Aug, 2023' },
              { label: 'Amount', value: `$${total.toLocaleString()}` },
              { label: 'Status', value: 'Pending' },
            ].map(m => (
              <div key={m.label} className="col-auto me-4 mb-2">
                <p className="text-muted mb-0" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</p>
                <p className="fw-bold mb-0">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Items table */}
          <div className="table-responsive mb-4">
            <table className="table table-bordered mb-0" style={{ fontSize: '14px' }}>
              <thead className="bg-light-subtle">
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Size</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Unit Price</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {ITEMS.map((item, i) => (
                  <tr key={i}>
                    <td className="text-muted">{i + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={item.img} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px' }} />
                        <span className="fw-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{item.size}</td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-end">${item.price}</td>
                    <td className="text-end fw-bold">${item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="row justify-content-end">
            <div className="col-md-5">
              <table className="table table-sm mb-0" style={{ fontSize: '14px' }}>
                <tbody>
                  <tr><td className="text-muted">Sub Total:</td><td className="text-end fw-medium">${subtotal}</td></tr>
                  <tr><td className="text-muted">Discount:</td><td className="text-end text-danger">-${discount}</td></tr>
                  <tr><td className="text-muted">Tax (15.5%):</td><td className="text-end">${tax}</td></tr>
                  <tr className="border-top">
                    <td className="fw-bold">Grand Total:</td>
                    <td className="text-end fw-bold text-primary fs-16">${total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr />
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-light d-flex align-items-center gap-2" onClick={() => window.print()}>
              <iconify-icon icon="solar:printer-bold-duotone"></iconify-icon> Print
            </button>
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <iconify-icon icon="solar:check-circle-bold"></iconify-icon> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
