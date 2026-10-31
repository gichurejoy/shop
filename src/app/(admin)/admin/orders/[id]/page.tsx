'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { IOrder, OrderStatus, PaymentStatus } from '@/types/order';

const BASE = 'https://techzaa.in/larkon/admin/assets/images';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const [showTrackingEdit, setShowTrackingEdit] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await apiClient.orders.get(orderId);
      setOrder(data);
      if (data.trackingNumber) {
        setTrackingInput(data.trackingNumber);
      }
    } catch (err: any) {
      toast.error('Could not load order: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    try {
      setUpdating(true);
      const updated = await apiClient.orders.updateStatus(order.id, newStatus, order.paymentStatus, order.trackingNumber);
      setOrder(updated);
      toast.success(`Order #${updated.orderNumber} status changed to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusToggle = async () => {
    if (!order) return;
    const nextPaymentStatus: PaymentStatus = order.paymentStatus === 'paid' ? 'unpaid' : 'paid';
    try {
      setUpdating(true);
      const updated = await apiClient.orders.updateStatus(order.id, order.status, nextPaymentStatus, order.trackingNumber);
      setOrder(updated);
      toast.success(`Order payment status marked as ${nextPaymentStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error('Failed to update payment status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveTracking = async () => {
    if (!order) return;
    try {
      setUpdating(true);
      const updated = await apiClient.orders.updateStatus(order.id, order.status, order.paymentStatus, trackingInput);
      setOrder(updated);
      setShowTrackingEdit(false);
      toast.success('Tracking number updated successfully!');
    } catch (err: any) {
      toast.error('Failed to update tracking: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <iconify-icon icon="solar:danger-triangle-bold-duotone" className="fs-50 text-warning mb-3"></iconify-icon>
          <h4>Order Not Found</h4>
          <p className="text-muted">The order reference &quot;{orderId}&quot; could not be retrieved from the database.</p>
          <Link href="/admin/orders" className="btn btn-primary mt-2">
            Back to Orders List
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'paid';
  const createdDate = new Date(order.createdAt);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + createdDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Calculate stage progress
  const getProgressState = (stage: 'confirming' | 'payment' | 'processing' | 'shipping' | 'delivered') => {
    const status = order.status;
    if (stage === 'confirming') return { width: '100%', color: 'bg-success', label: 'Order Confirmed' };
    if (stage === 'payment') {
      return isPaid
        ? { width: '100%', color: 'bg-success', label: 'Payment Paid' }
        : { width: '50%', color: 'bg-warning', label: 'Payment Pending' };
    }
    if (stage === 'processing') {
      if (status === 'pending') return { width: '0%', color: 'bg-primary', label: 'Processing' };
      if (status === 'processing') return { width: '60%', color: 'bg-warning', label: 'Processing', active: true };
      return { width: '100%', color: 'bg-success', label: 'Processed' };
    }
    if (stage === 'shipping') {
      if (status === 'pending' || status === 'processing') return { width: '0%', color: 'bg-primary', label: 'Shipping' };
      if (status === 'shipped') return { width: '70%', color: 'bg-warning', label: 'In Transit', active: true };
      return { width: '100%', color: 'bg-success', label: 'Shipped' };
    }
    if (stage === 'delivered') {
      if (status === 'delivered') return { width: '100%', color: 'bg-success', label: 'Delivered' };
      return { width: '0%', color: 'bg-primary', label: 'Delivered' };
    }
    return { width: '0%', color: 'bg-primary', label: '' };
  };

  const confirmingProg = getProgressState('confirming');
  const paymentProg = getProgressState('payment');
  const processingProg = getProgressState('processing');
  const shippingProg = getProgressState('shipping');
  const deliveredProg = getProgressState('delivered');

  return (
    <div className="row">
      {/* Left Column (9/12) */}
      <div className="col-xl-9 col-lg-8">
        <div className="row">
          <div className="col-lg-12">

            {/* Order Header Card */}
            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                  <div>
                    <h4 className="fw-medium text-dark d-flex align-items-center gap-2 mb-1">
                      #{order.orderNumber || order.id}{' '}
                      <span className={`badge ${isPaid ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} px-2 py-1 fs-13 text-capitalize`}>
                        {order.paymentStatus}
                      </span>
                      <span className={`badge ${
                        order.status === 'delivered' ? 'bg-success-subtle text-success border border-success' :
                        order.status === 'shipped' ? 'bg-primary-subtle text-primary border border-primary' :
                        order.status === 'processing' ? 'bg-warning-subtle text-warning border border-warning' :
                        order.status === 'cancelled' ? 'bg-danger-subtle text-danger border border-danger' :
                        'bg-secondary-subtle text-secondary border border-secondary'
                      } fs-13 px-2 py-1 rounded text-capitalize`}>
                        {order.status}
                      </span>
                    </h4>
                    <p className="mb-0 text-muted fs-13">
                      Order / Order Details / #{order.orderNumber || order.id} &mdash; {formattedDate}
                    </p>
                  </div>
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    {/* Status Dropdown */}
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary dropdown-toggle btn-sm text-capitalize"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        disabled={updating}
                      >
                        Status: <strong className="ms-1">{order.status}</strong>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow">
                        <li><h6 className="dropdown-header">Change Fulfillment Status</h6></li>
                        {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                          <li key={st}>
                            <button
                              type="button"
                              className={`dropdown-item text-capitalize ${order.status === st ? 'active' : ''}`}
                              onClick={() => handleStatusChange(st)}
                            >
                              {st}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={handlePaymentStatusToggle}
                      className={`btn btn-sm ${isPaid ? 'btn-outline-warning' : 'btn-outline-success'}`}
                      disabled={updating}
                    >
                      {isPaid ? 'Mark Unpaid' : 'Mark As Paid'}
                    </button>

                    <Link
                      href={`/tracking/${order.orderNumber || order.id}`}
                      target="_blank"
                      className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                    >
                      <iconify-icon icon="solar:routing-2-broken" className="fs-16"></iconify-icon>
                      Customer Tracking View
                    </Link>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <h4 className="fw-medium text-dark">Progress</h4>
                </div>
                <div className="row row-cols-xxl-5 row-cols-md-2 row-cols-1">
                  <div className="col">
                    <div className="progress mt-3" style={{ height: '10px' }}>
                      <div className={`progress-bar progress-bar-striped progress-bar-animated ${confirmingProg.color}`} role="progressbar" style={{ width: confirmingProg.width }}></div>
                    </div>
                    <p className="mb-0 mt-2">{confirmingProg.label}</p>
                  </div>
                  <div className="col">
                    <div className="progress mt-3" style={{ height: '10px' }}>
                      <div className={`progress-bar progress-bar-striped progress-bar-animated ${paymentProg.color}`} role="progressbar" style={{ width: paymentProg.width }}></div>
                    </div>
                    <p className="mb-0 mt-2">{paymentProg.label}</p>
                  </div>
                  <div className="col">
                    <div className="progress mt-3" style={{ height: '10px' }}>
                      <div className={`progress-bar progress-bar-striped progress-bar-animated ${processingProg.color}`} role="progressbar" style={{ width: processingProg.width }}></div>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <p className="mb-0">{processingProg.label}</p>
                      {processingProg.active && (
                        <div className="spinner-border spinner-border-sm text-warning" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col">
                    <div className="progress mt-3" style={{ height: '10px' }}>
                      <div className={`progress-bar progress-bar-striped progress-bar-animated ${shippingProg.color}`} role="progressbar" style={{ width: shippingProg.width }}></div>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <p className="mb-0">{shippingProg.label}</p>
                      {shippingProg.active && (
                        <div className="spinner-border spinner-border-sm text-warning" role="status">
                          <span className="visually-hidden">In Transit...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col">
                    <div className="progress mt-3" style={{ height: '10px' }}>
                      <div className={`progress-bar progress-bar-striped progress-bar-animated ${deliveredProg.color}`} role="progressbar" style={{ width: deliveredProg.width }}></div>
                    </div>
                    <p className="mb-0 mt-2">{deliveredProg.label}</p>
                  </div>
                </div>
              </div>

              <div className="card-footer d-flex flex-wrap align-items-center justify-content-between bg-light-subtle gap-2">
                <div className="d-flex align-items-center gap-2">
                  <p className="border rounded mb-0 px-2 py-1 bg-body fs-13">
                    <i className="bx bx-arrow-from-left align-middle fs-16 me-1"></i>
                    Tracking Number:{' '}
                    <span className="text-dark fw-medium">
                      {order.trackingNumber || 'Not assigned'}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowTrackingEdit(!showTrackingEdit)}
                    className="btn btn-sm btn-link text-decoration-none text-muted p-0 ms-1"
                    title="Edit tracking number"
                  >
                    <i className="bx bx-edit-alt fs-16"></i>
                  </button>
                </div>

                {showTrackingEdit && (
                  <div className="d-flex align-items-center gap-2 my-1">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. TRK-98234-KE"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      style={{ width: '200px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleSaveTracking}
                      disabled={updating}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowTrackingEdit(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <div>
                  {order.status === 'pending' && (
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => handleStatusChange('processing')}
                      disabled={updating}
                    >
                      Mark As Processing
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStatusChange('shipped')}
                      disabled={updating}
                    >
                      Make As Ready To Ship
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusChange('delivered')}
                      disabled={updating}
                    >
                      Mark As Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Product Table Card */}
            <div className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Ordered Items ({order.items.length})</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table align-middle mb-0 table-hover table-centered">
                    <thead className="bg-light-subtle border-bottom">
                      <tr>
                        <th>Product Name &amp; Spec</th>
                        <th>Status</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Est. Tax</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, i) => {
                        const itemTax = ((order.tax || 0) / (order.items.length || 1)).toFixed(2);
                        const itemTotal = (item.price * item.quantity).toFixed(2);
                        return (
                          <tr key={item.id || i}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="rounded bg-light avatar-md d-flex align-items-center justify-content-center overflow-hidden border">
                                  <img
                                    src={item.image || `${BASE}/product/p-1.png`}
                                    alt={item.name}
                                    className="avatar-md object-fit-cover"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src = `${BASE}/product/p-1.png`;
                                    }}
                                  />
                                </div>
                                <div>
                                  <span className="text-dark fw-medium fs-15">{item.name}</span>
                                  <p className="text-muted mb-0 mt-1 fs-13">
                                    {item.selectedSize && <span className="me-2">Size: {item.selectedSize}</span>}
                                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                    {!item.selectedSize && !item.selectedColor && <span>Standard Edition</span>}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${
                                order.status === 'delivered' ? 'bg-success-subtle text-success' :
                                order.status === 'shipped' ? 'bg-info-subtle text-info' :
                                order.status === 'processing' ? 'bg-warning-subtle text-warning' :
                                'bg-light text-dark'
                              } px-2 py-1 fs-13 text-capitalize`}>
                                {order.status === 'delivered' ? 'Delivered' : order.status === 'shipped' ? 'Dispatched' : order.status === 'processing' ? 'Packaging' : 'Ready'}
                              </span>
                            </td>
                            <td>{item.quantity}</td>
                            <td>${Number(item.price).toFixed(2)}</td>
                            <td>${itemTax}</td>
                            <td className="fw-medium text-dark">${itemTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Timeline Card */}
            <div className="card mb-3">
              <div className="card-header">
                <h4 className="card-title mb-0">Order Timeline</h4>
              </div>
              <div className="card-body">
                <div className="position-relative ms-2">
                  <span className="position-absolute start-0 top-0 border border-dashed h-100"></span>

                  {order.timeline && order.timeline.length > 0 ? (
                    order.timeline.map((event, idx) => (
                      <div key={idx} className="position-relative ps-4">
                        <div className="mb-4">
                          <span className={`position-absolute start-0 avatar-sm translate-middle-x bg-light d-inline-flex align-items-center justify-content-center rounded-circle ${
                            idx === order.timeline.length - 1 ? 'text-primary' : 'text-success'
                          } fs-20`}>
                            {idx === order.timeline.length - 1 ? (
                              <i className="bx bx-current-location"></i>
                            ) : (
                              <i className="bx bx-check-circle"></i>
                            )}
                          </span>
                          <div className="ms-2 d-flex flex-wrap gap-2 align-items-center justify-content-between">
                            <div>
                              <h5 className="mb-1 text-dark fw-medium fs-15">{event.title}</h5>
                              <p className="mb-0 text-muted fs-13">{event.description}</p>
                            </div>
                            <p className="mb-0 text-muted fs-12">
                              {new Date(event.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="position-relative ps-4">
                      <div className="mb-4">
                        <span className="position-absolute start-0 avatar-sm translate-middle-x bg-light d-inline-flex align-items-center justify-content-center rounded-circle text-success fs-20">
                          <i className="bx bx-check-circle"></i>
                        </span>
                        <div className="ms-2 d-flex flex-wrap gap-2 align-items-center justify-content-between">
                          <div>
                            <h5 className="mb-1 text-dark fw-medium fs-15">Order Placed</h5>
                            <p className="mb-0">Confirmed by {order.customerName}</p>
                          </div>
                          <p className="mb-0">{formattedDate}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Meta Bar */}
            <div className="card bg-light-subtle mb-3">
              <div className="card-body">
                <div className="row g-3 g-lg-0">
                  <div className="col-lg-3 border-end">
                    <div className="d-flex align-items-center gap-3 justify-content-between px-3">
                      <div>
                        <p className="text-dark fw-medium fs-16 mb-1">Vendor</p>
                        <p className="mb-0 text-muted">Waveron Atelier</p>
                      </div>
                      <div className="avatar bg-light d-flex align-items-center justify-content-center rounded">
                        <iconify-icon icon="solar:shop-2-bold-duotone" className="fs-35 text-primary"></iconify-icon>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 border-end">
                    <div className="d-flex align-items-center gap-3 justify-content-between px-3">
                      <div>
                        <p className="text-dark fw-medium fs-16 mb-1">Date</p>
                        <p className="mb-0 text-muted">
                          {createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="avatar bg-light d-flex align-items-center justify-content-center rounded">
                        <iconify-icon icon="solar:calendar-date-bold-duotone" className="fs-35 text-primary"></iconify-icon>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 border-end">
                    <div className="d-flex align-items-center gap-3 justify-content-between px-3">
                      <div>
                        <p className="text-dark fw-medium fs-16 mb-1">Paid By</p>
                        <p className="mb-0 text-muted">{order.customerName}</p>
                      </div>
                      <div className="avatar bg-light d-flex align-items-center justify-content-center rounded">
                        <iconify-icon icon="solar:user-circle-bold-duotone" className="fs-35 text-primary"></iconify-icon>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="d-flex align-items-center gap-3 justify-content-between px-3">
                      <div>
                        <p className="text-dark fw-medium fs-16 mb-1">Reference #IMEMO</p>
                        <p className="mb-0 text-muted">#{order.orderNumber || order.id}</p>
                      </div>
                      <div className="avatar bg-light d-flex align-items-center justify-content-center rounded">
                        <iconify-icon icon="solar:clipboard-text-bold-duotone" className="fs-35 text-primary"></iconify-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Column (3/12) */}
      <div className="col-xl-3 col-lg-4">

        {/* Order Summary */}
        <div className="card mb-3">
          <div className="card-header">
            <h4 className="card-title mb-0">Order Summary</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table mb-0">
                <tbody>
                  <tr>
                    <td className="px-0">
                      <p className="d-flex mb-0 align-items-center gap-1">
                        <iconify-icon icon="solar:clipboard-text-broken"></iconify-icon> Sub Total :
                      </p>
                    </td>
                    <td className="text-end text-dark fw-medium px-0">
                      ${Number(order.subtotal || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-0">
                      <p className="d-flex mb-0 align-items-center gap-1">
                        <iconify-icon icon="solar:ticket-broken" className="align-middle"></iconify-icon> Discount :
                      </p>
                    </td>
                    <td className="text-end text-danger fw-medium px-0">
                      -${Number(order.discount || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-0">
                      <p className="d-flex mb-0 align-items-center gap-1">
                        <iconify-icon icon="solar:kick-scooter-broken" className="align-middle"></iconify-icon> Shipping Fee :
                      </p>
                    </td>
                    <td className="text-end text-dark fw-medium px-0">
                      {order.shippingFee && order.shippingFee > 0 ? `$${Number(order.shippingFee).toFixed(2)}` : 'Free'}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-0">
                      <p className="d-flex mb-0 align-items-center gap-1">
                        <iconify-icon icon="solar:calculator-minimalistic-broken" className="align-middle"></iconify-icon> Est. Tax :
                      </p>
                    </td>
                    <td className="text-end text-dark fw-medium px-0">
                      ${Number(order.tax || 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer d-flex align-items-center justify-content-between bg-light-subtle">
            <div>
              <p className="fw-medium text-dark mb-0">Total Amount</p>
            </div>
            <div>
              <h5 className="fw-bold text-dark mb-0">${Number(order.total || 0).toFixed(2)}</h5>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="card mb-3">
          <div className="card-header">
            <h4 className="card-title mb-0">Payment Information</h4>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-3 bg-light avatar d-flex align-items-center justify-content-center">
                <img
                  src={order.paymentMethod === 'mpesa' ? `${BASE}/card/mastercard.svg` : `${BASE}/card/mastercard.svg`}
                  alt=""
                  className="avatar-sm"
                />
              </div>
              <div>
                <p className="mb-1 text-dark fw-medium text-capitalize">{order.paymentMethod}</p>
                <p className="mb-0 text-muted fs-12">Authorized Payment</p>
              </div>
              <div className="ms-auto">
                <iconify-icon
                  icon={isPaid ? 'solar:check-circle-broken' : 'solar:clock-circle-broken'}
                  className={`fs-22 ${isPaid ? 'text-success' : 'text-warning'}`}
                ></iconify-icon>
              </div>
            </div>
            <p className="text-dark mb-1 fw-medium">
              Order Ref : <span className="text-muted fw-normal fs-13">#{order.orderNumber || order.id}</span>
            </p>
            <p className="text-dark mb-0 fw-medium">
              Customer Name : <span className="text-muted fw-normal fs-13">{order.customerName}</span>
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="card mb-3">
          <div className="card-header">
            <h4 className="card-title mb-0">Customer Details</h4>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center gap-2">
              <img src={`${BASE}/users/avatar-1.jpg`} alt="" className="avatar rounded-3 border border-light border-3" />
              <div>
                <p className="mb-1 fw-medium text-dark">{order.customerName}</p>
                <a href={`mailto:${order.customerEmail}`} className="link-primary fs-13">
                  {order.customerEmail}
                </a>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <h5 className="fs-14">Contact Number</h5>
            </div>
            <p className="mb-1 text-muted fs-13">{order.customerPhone || 'Not provided'}</p>

            <div className="d-flex justify-content-between mt-3">
              <h5 className="fs-14">Shipping Address</h5>
            </div>
            <div className="text-muted fs-13">
              <p className="mb-1 text-dark fw-medium">{order.shippingAddress?.name || order.customerName}</p>
              <p className="mb-1">{order.shippingAddress?.line1 || 'Primary Delivery Address'}</p>
              {order.shippingAddress?.line2 && <p className="mb-1">{order.shippingAddress.line2}</p>}
              <p className="mb-1">
                {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.zip].filter(Boolean).join(', ')}
              </p>
              <p className="mb-1">{order.shippingAddress?.country || 'United States'}</p>
              <p>{order.shippingAddress?.phone || order.customerPhone}</p>
            </div>

            <div className="d-flex justify-content-between mt-3">
              <h5 className="fs-14">Billing Address</h5>
            </div>
            <p className="mb-1 text-muted fs-13">Same as shipping address</p>
          </div>
        </div>

        {/* Map */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="mapouter">
              <div className="gmap_canvas">
                <iframe
                  className="gmap_iframe rounded"
                  width="100%"
                  style={{ height: '300px' }}
                  frameBorder={0}
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?width=1980&height=400&hl=en&q=${encodeURIComponent(
                    [order.shippingAddress?.city, order.shippingAddress?.country].filter(Boolean).join(' ') || 'Nairobi'
                  )}&t=&z=13&ie=UTF8&iwloc=B&output=embed`}
                ></iframe>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

