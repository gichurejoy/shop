"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Printer, 
  Download, 
  Mail, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  ExternalLink, 
  X,
  CreditCard,
  Building2,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

export interface InvoiceViewProps {
  order: any;
  onClose?: () => void;
  isModal?: boolean;
}

export function InvoiceView({ order, onClose, isModal = false }: InvoiceViewProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  if (!order) return null;

  // Normalize order data to handle both raw API IOrder and Dashboard formatted orders
  const orderId = order.orderNumber || order.id || 'LK-2024-58291';
  const invoiceNumber = `INV-${orderId.replace(/^(ORD-|LK-)/, '')}`;
  const issueDate = order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'May 28, 2026');

  const customerName = order.customerName || order.shippingAddress?.name || 'Sarah Johnson';
  const customerEmail = order.customerEmail || 'customer@waveron.com';
  const customerPhone = order.customerPhone || order.shippingAddress?.phone || '+1 (555) 123-4567';

  const shippingAddr = order.shippingAddress || {
    name: customerName,
    line1: '123 Maple Street',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    country: 'United States'
  };

  // Normalize items array
  let itemsList: any[] = [];
  if (Array.isArray(order.items) && order.items.length > 0) {
    itemsList = order.items;
  } else if (typeof order.items === 'string') {
    // If it's a comma-separated string like "1x Eternity Band Gold Ring, 1x Cashmere Cardigan"
    const parsed = order.items.split(',').map((part: string, idx: number) => {
      const match = part.trim().match(/^(\d+)x\s+(.+)$/);
      if (match) {
        return {
          id: `item-${idx}`,
          name: match[2],
          quantity: parseInt(match[1], 10),
          price: idx === 0 ? Math.round((Number(order.total) || 299) * 0.6) : Math.round((Number(order.total) || 299) * 0.4),
          image: idx % 2 === 0 
            ? 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop'
            : 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop',
          selectedSize: idx % 2 === 0 ? '7 / 54mm' : 'M',
          sku: `LK-ART-${1000 + idx}`
        };
      }
      return {
        id: `item-${idx}`,
        name: part.trim(),
        quantity: 1,
        price: Number(order.total) || 150,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop',
        sku: `LK-ART-${1000 + idx}`
      };
    });
    itemsList = parsed;
  } else {
    itemsList = [
      {
        id: 'item-1',
        name: 'Classic Gold Band Ring',
        price: 299,
        quantity: 1,
        selectedSize: 'M',
        selectedColor: '18k Yellow Gold',
        sku: 'LK-JWL-001',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop'
      }
    ];
  }

  // Calculate or normalize financial figures
  const totalNum = typeof order.total === 'number' ? order.total : parseFloat(String(order.total).replace(/[^0-9.]/g, '')) || 299;
  const subtotalNum = typeof order.subtotal === 'number' ? order.subtotal : itemsList.reduce((sum, item) => sum + (Number(item.price) * (Number(item.quantity) || 1)), 0);
  const taxNum = typeof order.tax === 'number' ? order.tax : (order.tax ? parseFloat(order.tax) : +(subtotalNum * 0.08).toFixed(2));
  const shippingFeeNum = typeof order.shippingFee === 'number' ? order.shippingFee : 0;
  const discountNum = typeof order.discount === 'number' ? order.discount : (order.discount ? parseFloat(order.discount) : 0);

  const trackingNo = order.trackingNo || order.trackingNumber || 'TRK-983271-US';
  const carrier = order.carrier || (order.shippingMethod === 'express' ? 'FedEx Priority Overnight' : 'Atelier Insured Delivery');
  const paymentMethod = order.paymentMethod ? String(order.paymentMethod).toUpperCase() : 'CREDIT CARD (VISA •••• 4242)';

  const handlePrint = () => {
    window.print();
  };

  const handleEmailInvoice = () => {
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      toast.success(`Official invoice ${invoiceNumber} sent to ${customerEmail}`);
    }, 900);
  };

  return (
    <div className={`w-full ${isModal ? 'max-w-4xl mx-auto' : 'max-w-4xl mx-auto my-8'} print:m-0 print:p-0 print:max-w-none`}>
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#8B5A3C]" />
          <div>
            <span className="font-bold text-[#3D2817] text-sm sm:text-base">Official Invoice</span>
            <span className="ml-2 px-2 py-0.5 bg-[#FAF6F0] text-[#8B5A3C] text-xs font-semibold rounded-md border border-[#8B5A3C]/20">
              {invoiceNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8B5A3C] hover:bg-[#6F4630] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleEmailInvoice}
            disabled={isSendingEmail}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-[#3D2817] text-xs sm:text-sm font-semibold rounded-lg border border-gray-200 transition-all disabled:opacity-50"
            title="Send Email Receipt"
          >
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{isSendingEmail ? 'Sending...' : 'Email'}</span>
          </button>

          <Link
            href={`/tracking/${orderId}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-[#3D2817] text-xs sm:text-sm font-semibold rounded-lg border border-gray-200 transition-all"
            title="Track Package"
          >
            <Truck className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">Track</span>
          </Link>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all ml-1"
              title="Close Invoice"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Printable Invoice Card */}
      <div 
        id="printable-invoice"
        className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-8 sm:p-12 relative overflow-hidden print:shadow-none print:border-none print:p-6 print:rounded-none"
      >
        {/* Subtle Decorative Atelier Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3D2817] via-[#8B5A3C] to-[#D4A574]" />

        {/* Header Section: Brand + Metadata */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-8 border-b border-gray-100">
          <div>
            <h1 
              className="text-3xl sm:text-4xl font-bold text-[#3D2817] tracking-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Lumière & Knit
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#8B5A3C] font-semibold mt-1">
              Haute Joaillerie & Cashmere Atelier
            </p>
            <div className="text-xs text-gray-500 mt-3 space-y-0.5 leading-relaxed">
              <p>742 Evergreen Terrace, Suite 400</p>
              <p>Portland, OR 97201, United States</p>
              <p>Tax ID / EIN: <span className="font-mono text-gray-700">84-2910482</span> • VAT ID: <span className="font-mono text-gray-700">EU372001928</span></p>
              <p>Concierge: concierge@lumiereknit.com • +1 (800) 555-0199</p>
            </div>
          </div>

          <div className="w-full md:w-auto md:text-right flex flex-col items-start md:items-end">
            {/* Status Stamp */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full font-bold text-xs uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PAID IN FULL</span>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between md:justify-end gap-4">
                <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Invoice No:</span>
                <span className="font-mono font-bold text-[#3D2817]">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between md:justify-end gap-4">
                <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Order No:</span>
                <span className="font-mono font-semibold text-gray-700">#{orderId}</span>
              </div>
              <div className="flex justify-between md:justify-end gap-4">
                <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Issue Date:</span>
                <span className="text-gray-700">{issueDate}</span>
              </div>
              <div className="flex justify-between md:justify-end gap-4">
                <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Payment Method:</span>
                <span className="text-gray-700 font-medium">{paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses & Dispatch Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8 border-b border-gray-100 text-sm">
          {/* Billed To */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
            <div className="text-gray-800 space-y-1 font-medium">
              <p className="font-bold text-[#3D2817] text-base">{customerName}</p>
              <p className="text-xs text-gray-600">{customerEmail}</p>
              <p className="text-xs text-gray-600">{customerPhone}</p>
              <p className="text-xs text-gray-500 pt-1">Client Tier: <span className="text-[#8B5A3C] font-semibold">VIP Atelier Club</span></p>
            </div>
          </div>

          {/* Shipped To */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipment Destination</h3>
            <div className="text-gray-800 space-y-1 font-medium text-xs sm:text-sm">
              <p className="font-bold text-[#3D2817]">{shippingAddr.name || customerName}</p>
              <p>{shippingAddr.line1}</p>
              {shippingAddr.line2 && <p>{shippingAddr.line2}</p>}
              <p>{shippingAddr.city}, {shippingAddr.state} {shippingAddr.zip}</p>
              <p>{shippingAddr.country || 'United States'}</p>
            </div>
          </div>

          {/* Logistics & Security */}
          <div className="bg-[#FAF6F0]/60 p-4 rounded-xl border border-[#D4A574]/30">
            <h3 className="text-xs font-bold text-[#8B5A3C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Delivery & Authentication
            </h3>
            <div className="space-y-1.5 text-xs text-gray-700">
              <div>
                <span className="text-gray-500 block">Carrier Service:</span>
                <span className="font-semibold text-[#3D2817]">{carrier}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Waybill / Tracking:</span>
                <Link 
                  href={`/tracking/${orderId}`}
                  className="font-mono font-bold text-[#8B5A3C] hover:underline inline-flex items-center gap-1"
                >
                  {trackingNo}
                  <ExternalLink className="w-3 h-3 print:hidden" />
                </Link>
              </div>
              <div>
                <span className="text-gray-500 block">Security Seal:</span>
                <span className="text-emerald-700 font-medium">Tamper-Proof Artisan Inspected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-2 w-10 text-center">#</th>
                  <th className="py-3 px-4">Item & Atelier Specifications</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {itemsList.map((item, idx) => {
                  const qty = Number(item.quantity) || 1;
                  const unitPrice = Number(item.price) || 0;
                  const itemTotal = unitPrice * qty;

                  return (
                    <tr key={item.id || idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-2 text-center text-xs font-mono text-gray-400 align-top">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-bold text-[#3D2817] leading-snug">{item.name}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                              {item.sku && <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">SKU: {item.sku}</span>}
                              {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                              {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-gray-700 align-top">
                        {qty}
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-700 align-top">
                        ${unitPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-[#3D2817] align-top">
                        ${itemTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculation & Financial Totals */}
        <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-8 items-start">
          {/* Terms, Notes & Authenticity Pledge */}
          <div className="w-full md:w-7/12 space-y-3 text-xs text-gray-500">
            <div className="p-4 bg-[#FAF6F0]/50 rounded-xl border border-gray-100">
              <h4 className="font-bold text-[#3D2817] text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8B5A3C]" />
                Lifetime Craftsmanship Guarantee
              </h4>
              <p className="leading-relaxed">
                Every bespoke piece from Lumière & Knit is verified for gemstone purity and Mongolian cashmere density. 
                Complimentary cleaning, ring resizing, and knit repair are valid for life at any atelier location.
              </p>
            </div>
            <p className="text-[11px] text-gray-400">
              Returns are accepted within 30 days of delivery in pristine condition with original authentication tags intact.
              For assistance, contact our 24/7 dedicated client concierge.
            </p>
          </div>

          {/* Subtotal, Tax & Total Box */}
          <div className="w-full md:w-5/12 bg-gray-50/80 p-5 rounded-2xl border border-gray-100 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">${subtotalNum.toFixed(2)}</span>
            </div>

            {discountNum > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>VIP Atelier Courtesy Discount</span>
                <span>-${discountNum.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Bespoke Gift Packaging</span>
              <span className="text-gray-500 font-medium">Complimentary</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Insured Courier Shipping</span>
              <span className="text-gray-800 font-medium">
                {shippingFeeNum === 0 ? <span className="text-emerald-700 font-semibold">Free</span> : `$${shippingFeeNum.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-semibold text-gray-800">${taxNum.toFixed(2)}</span>
            </div>

            <div className="border-t-2 border-gray-200 pt-3 flex justify-between items-baseline">
              <span className="text-base font-bold text-[#3D2817]">Grand Total (USD)</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#8B5A3C]">
                  ${totalNum.toFixed(2)}
                </span>
                <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                  Payment Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Atelier Signature */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Lumière & Knit Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-serif italic text-gray-500">Authorized Master Jeweler & Weaver Signature</span>
            <div className="w-24 border-b border-gray-400 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
