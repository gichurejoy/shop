'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PRODUCTS = [
  { id: 1, name: 'Men Black Slim Fit T-shirt', img: 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png', price: 80 },
  { id: 2, name: 'Olive Green Leather Bag',    img: 'https://techzaa.in/larkon/admin/assets/images/product/p-2.png', price: 136 },
  { id: 3, name: 'Women Golden Dress',          img: 'https://techzaa.in/larkon/admin/assets/images/product/p-3.png', price: 219 },
];

type LineItem = { productId: number; name: string; img: string; qty: number; price: number };

export default function InvoiceAddPage() {
  const [items, setItems] = useState<LineItem[]>([
    { productId: 1, name: 'Men Black Slim Fit T-shirt', img: PRODUCTS[0].img, qty: 1, price: 80 },
  ]);
  const [discount, setDiscount] = useState(50);
  const [taxRate] = useState(15.5);
  const [vendorLogo, setVendorLogo] = useState<string>('');
  const [clientLogo, setClientLogo] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();

  const addItem = () => {
    const p = PRODUCTS[0];
    setItems([...items, { productId: p.id, name: p.name, img: p.img, qty: 1, price: p.price }]);
  };
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, key: keyof LineItem, val: string | number) => {
    const updated = [...items];
    if (key === 'productId') {
      const p = PRODUCTS.find(p => p.id === +val);
      if (p) { updated[i] = { ...updated[i], productId: p.id, name: p.name, img: p.img, price: p.price }; }
    } else {
      (updated[i] as Record<string, unknown>)[key] = val;
    }
    setItems(updated);
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const taxAmt = Math.round(subtotal * taxRate / 100);
  const total = subtotal - discount + taxAmt;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 className="fw-bold mb-0">Create Invoice</h4>
        <Link href="/admin/invoices" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
          <iconify-icon icon="solar:arrow-left-linear"></iconify-icon> Back to Invoices
        </Link>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          {/* From / To */}
          <div className="card mb-3">
            <div className="card-header"><h5 className="card-title mb-0">Invoice Details</h5></div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <iconify-icon icon="solar:buildings-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
                    Issue From
                  </h6>
                  <div className="mb-2">
                    <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Vendor Logo</label>
                    <div className="d-flex gap-2">
                      <input type="file" className="form-control form-control-sm" accept="image/*" style={{ flex: 1 }} onChange={e => { if(e.target.files?.[0]) setVendorLogo(URL.createObjectURL(e.target.files[0])) }} />
                      <input type="text" className="form-control form-control-sm" placeholder="Or paste URL..." style={{ flex: 1 }} value={vendorLogo} onChange={e => setVendorLogo(e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Company Name</label>
                    <input type="text" className="form-control form-control-sm" defaultValue="Larkon Admin.INC" id="vendor-name" />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Address</label>
                    <textarea className="form-control form-control-sm" rows={2} defaultValue="2437 Romano Street Cambridge, MA 02141"></textarea>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Phone</label>
                      <input type="text" className="form-control form-control-sm" defaultValue="+(31) 781-417-2004" />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Email</label>
                      <input type="email" className="form-control form-control-sm" defaultValue="admin@larkon.com" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <iconify-icon icon="solar:user-bold-duotone" style={{ color: '#ff6c2f', fontSize: '18px' }}></iconify-icon>
                    Issue For
                  </h6>
                  <div className="mb-2">
                    <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Client Logo</label>
                    <div className="d-flex gap-2">
                      <input type="file" className="form-control form-control-sm" accept="image/*" style={{ flex: 1 }} onChange={e => { if(e.target.files?.[0]) setClientLogo(URL.createObjectURL(e.target.files[0])) }} />
                      <input type="text" className="form-control form-control-sm" placeholder="Or paste URL..." style={{ flex: 1 }} value={clientLogo} onChange={e => setClientLogo(e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Customer Name</label>
                    <input type="text" className="form-control form-control-sm" placeholder="Full name" id="client-name" />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Address</label>
                    <textarea className="form-control form-control-sm" rows={2} placeholder="Billing address"></textarea>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Phone</label>
                      <input type="text" className="form-control form-control-sm" placeholder="+(xxx) xxx-xxxx" />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Email</label>
                      <input type="email" className="form-control form-control-sm" placeholder="email@example.com" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Order Items</h5>
              <button onClick={addItem} className="btn btn-sm btn-primary d-flex align-items-center gap-1">
                <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Item
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0" style={{ fontSize: '14px' }}>
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Product</th>
                      <th style={{ width: '80px' }}>Qty</th>
                      <th style={{ width: '100px' }}>Price</th>
                      <th className="text-end" style={{ width: '90px' }}>Total</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img src={item.img} alt="" style={{ width: '36px', height: '36px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px' }} />
                            <select className="form-select form-select-sm" value={item.productId} onChange={e => updateItem(i, 'productId', e.target.value)} style={{ minWidth: '160px' }}>
                              {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                          </div>
                        </td>
                        <td>
                          <input type="number" className="form-control form-control-sm" value={item.qty} min={1} onChange={e => updateItem(i, 'qty', +e.target.value)} style={{ width: '65px' }} />
                        </td>
                        <td>
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">$</span>
                            <input type="number" className="form-control" value={item.price} onChange={e => updateItem(i, 'price', +e.target.value)} />
                          </div>
                        </td>
                        <td className="text-end fw-bold">${(item.price * item.qty).toFixed(2)}</td>
                        <td>
                          <button onClick={() => removeItem(i)} className="btn btn-sm btn-soft-danger p-1">
                            <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" style={{ fontSize: '16px' }}></iconify-icon>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <div className="card-header"><h5 className="card-title mb-0">Notes</h5></div>
            <div className="card-body">
              <textarea className="form-control" rows={3} placeholder="Additional notes for this invoice..."></textarea>
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="col-lg-4">
          <div className="card mb-3">
            <div className="card-header"><h5 className="card-title mb-0">Invoice Info</h5></div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Invoice Number</label>
                <input type="text" className="form-control form-control-sm" defaultValue="INV-0001" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Issue Date</label>
                <input type="date" className="form-control form-control-sm" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Due Date</label>
                <input type="date" className="form-control form-control-sm" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Status</label>
                <select className="form-select form-select-sm">
                  <option>Pending</option><option>Completed</option><option>Cancel</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header"><h5 className="card-title mb-0">Summary</h5></div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted" style={{ fontSize: '14px' }}>Subtotal</span>
                <span className="fw-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted" style={{ fontSize: '14px' }}>Discount</span>
                <div className="d-flex align-items-center gap-1">
                  <span className="input-group-text px-1" style={{ fontSize: '13px' }}>$</span>
                  <input type="number" value={discount} onChange={e => setDiscount(+e.target.value)} className="form-control form-control-sm text-end" style={{ width: '70px' }} />
                </div>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted" style={{ fontSize: '14px' }}>Tax ({taxRate}%)</span>
                <span className="fw-medium">${taxAmt.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Grand Total</span>
                <span className="fw-bold text-primary fs-16">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-light flex-fill d-flex align-items-center justify-content-center gap-2" onClick={() => setIsPreviewOpen(true)}>
              <iconify-icon icon="solar:printer-bold-duotone"></iconify-icon> Preview
            </button>
            <button className="btn btn-primary flex-fill d-flex align-items-center justify-content-center gap-2" onClick={() => router.push('/admin/invoices')}>
              <iconify-icon icon="solar:check-circle-bold"></iconify-icon> Save
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow-lg m-3" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header border-bottom d-flex justify-content-between align-items-center bg-light-subtle position-sticky top-0 z-1">
              <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                <iconify-icon icon="solar:document-text-bold-duotone" className="text-primary"></iconify-icon> Invoice Preview
              </h5>
              <button type="button" className="btn-close" onClick={() => setIsPreviewOpen(false)}></button>
            </div>
            <div className="card-body p-4 p-md-5 bg-white">
              <div className="row mb-5">
                <div className="col-sm-6">
                  {vendorLogo ? (
                    <img src={vendorLogo} alt="Vendor Logo" style={{ maxHeight: '80px', maxWidth: '250px', objectFit: 'contain', marginBottom: '16px' }} />
                  ) : (
                    <h3 className="fw-bold mb-3">{(document.getElementById('vendor-name') as HTMLInputElement)?.value || 'Larkon Admin.INC'}</h3>
                  )}
                  <div className="text-muted fs-14">
                    2437 Romano Street<br/>
                    Cambridge, MA 02141<br/>
                    +(31) 781-417-2004
                  </div>
                </div>
                <div className="col-sm-6 text-sm-end mt-4 mt-sm-0">
                  <h4 className="fw-bold text-uppercase text-muted mb-3">Invoice</h4>
                  {clientLogo ? (
                    <img src={clientLogo} alt="Client Logo" style={{ maxHeight: '80px', maxWidth: '250px', objectFit: 'contain', marginBottom: '16px' }} />
                  ) : null}
                  <div className="fs-14 fw-medium text-dark">Billed To:</div>
                  <div className="text-muted fs-14">
                    {(document.getElementById('client-name') as HTMLInputElement)?.value || 'Customer Name'}<br/>
                    Billing address here<br/>
                    email@example.com
                  </div>
                </div>
              </div>

              <div className="table-responsive mb-4">
                <table className="table table-bordered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Description</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Unit Price</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-end">${item.price.toFixed(2)}</td>
                        <td className="text-end fw-medium">${(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row justify-content-end">
                <div className="col-sm-6 col-md-5">
                  <table className="table table-sm table-borderless text-end">
                    <tbody>
                      <tr>
                        <td className="text-muted">Subtotal:</td>
                        <td className="fw-medium">${subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Discount:</td>
                        <td className="fw-medium text-danger">-${discount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Tax ({taxRate}%):</td>
                        <td className="fw-medium">${taxAmt.toFixed(2)}</td>
                      </tr>
                      <tr className="border-top border-dark border-2">
                        <td className="fw-bold fs-16 pt-2">Grand Total:</td>
                        <td className="fw-bold text-primary fs-18 pt-2">${total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="card-footer bg-light-subtle d-flex justify-content-end gap-2 position-sticky bottom-0">
              <button className="btn btn-light" onClick={() => setIsPreviewOpen(false)}>Close Preview</button>
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setIsPreviewOpen(false); router.push('/admin/invoices'); }}>
                <iconify-icon icon="solar:check-circle-bold"></iconify-icon> Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
