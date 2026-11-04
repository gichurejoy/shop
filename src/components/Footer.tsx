import React from 'react';
import Link from 'next/link';
import { CmsFooterSettings, DEFAULT_FOOTER_SETTINGS } from '@/lib/cms';

export function Footer({ settings = DEFAULT_FOOTER_SETTINGS }: { settings?: CmsFooterSettings }) {
  const cfg = { ...DEFAULT_FOOTER_SETTINGS, ...settings };
  const { socialLinks = {}, columns = [] } = cfg;

  return (
    <footer
      className="w-full transition-colors relative"
      style={{
        backgroundColor: cfg.backgroundColor || '#1E293B',
        color: cfg.textColor || '#94A3B8',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand & About Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-6">
            {cfg.logoUrl ? (
              <img src={cfg.logoUrl} alt={cfg.brandName} className="h-9 mb-4 object-contain" />
            ) : (
              <h3 className="text-white font-bold text-2xl mb-3 tracking-tight">
                {cfg.brandName || 'Store Commerce'}
              </h3>
            )}
            <p className="text-sm mb-5 leading-relaxed" style={{ color: cfg.textColor }}>
              {cfg.tagline || 'Your trusted partner for high quality products and exceptional customer service.'}
            </p>

            {/* Direct Contact Info */}
            <div className="space-y-1.5 text-xs mb-5 opacity-90">
              {cfg.address && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📍</span>
                  <span>{cfg.address}</span>
                </div>
              )}
              {cfg.contactPhone && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📞</span>
                  <a href={`tel:${cfg.contactPhone}`} className="hover:underline text-white">
                    {cfg.contactPhone}
                  </a>
                </div>
              )}
              {cfg.contactEmail && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">✉️</span>
                  <a href={`mailto:${cfg.contactEmail}`} className="hover:underline text-white">
                    {cfg.contactEmail}
                  </a>
                </div>
              )}
              {cfg.businessHours && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">🕒</span>
                  <span>{cfg.businessHours}</span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="flex gap-2">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors text-xs font-bold"
                  title="Facebook"
                >
                  f
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors text-xs font-bold"
                  title="Instagram"
                >
                  ig
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors text-xs font-bold"
                  title="Twitter / X"
                >
                  𝕏
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors text-xs font-bold"
                  title="YouTube"
                >
                  ▶
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors text-xs font-bold"
                  title="LinkedIn"
                >
                  in
                </a>
              )}
              {socialLinks.tiktok && (
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors text-xs font-bold"
                  title="TikTok"
                >
                  tt
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Navigation Columns */}
          {columns.map((col) => (
            <div key={col.id}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: cfg.textColor }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: cfg.textColor }}>
            {cfg.copyrightText || '© 2026 All rights reserved.'}
          </p>

          {/* Payment Method Badges */}
          {cfg.showPaymentBadges && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium mr-1 text-slate-400">Accepted Payments:</span>
              {(cfg.paymentMethods || []).map((method) => {
                const labels: Record<string, { name: string; bg: string; text: string }> = {
                  visa: { name: 'VISA', bg: 'bg-[#1A1F71]', text: 'text-white' },
                  mastercard: { name: 'Mastercard', bg: 'bg-[#EB001B]', text: 'text-white' },
                  mpesa: { name: 'M-PESA', bg: 'bg-[#008A00]', text: 'text-white' },
                  paypal: { name: 'PayPal', bg: 'bg-[#003087]', text: 'text-white' },
                  applepay: { name: 'Apple Pay', bg: 'bg-black', text: 'text-white' },
                  cash: { name: 'Cash on Delivery', bg: 'bg-slate-700', text: 'text-white' },
                };
                const m = labels[method.toLowerCase()] || { name: method.toUpperCase(), bg: 'bg-slate-700', text: 'text-white' };
                return (
                  <span
                    key={method}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 shadow-sm ${m.bg} ${m.text}`}
                  >
                    {m.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}