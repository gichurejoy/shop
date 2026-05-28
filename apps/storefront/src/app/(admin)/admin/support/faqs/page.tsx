'use client';

import { useState } from 'react';

const FAQ_CATEGORIES = ['General', 'Account', 'Billing', 'Orders', 'Products', 'Technical'];

const FAQS: Record<string, { q: string; a: string }[]> = {
  General: [
    { q: 'What is Larkon Admin?', a: 'Larkon Admin is a comprehensive e-commerce admin dashboard that helps you manage your online store, track orders, manage customers, and monitor analytics all in one place.' },
    { q: 'Is there a mobile app available?', a: 'Yes! Larkon Admin is fully responsive and works seamlessly on mobile devices. A dedicated mobile app is also available for iOS and Android.' },
    { q: 'How do I get started?', a: 'Simply log in with your credentials, complete your store setup by following the onboarding wizard, add your products, and you\'re ready to start selling!' },
    { q: 'Can I have multiple stores?', a: 'Yes, you can manage multiple stores from a single Larkon account. Navigate to Settings > Stores to add and switch between stores.' },
  ],
  Account: [
    { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page, enter your email address, and follow the link sent to your inbox to reset your password.' },
    { q: 'How do I update my profile information?', a: 'Go to Settings > Profile to update your name, email, phone number, avatar, and other personal details.' },
    { q: 'Can I add team members to my account?', a: 'Yes! Go to Users > Roles to create roles with specific permissions, then invite team members from the Users section.' },
    { q: 'How do I enable two-factor authentication?', a: 'Navigate to Settings > Security and toggle on Two-Factor Authentication. You can use an authenticator app or SMS.' },
  ],
  Billing: [
    { q: 'What payment methods do you accept?', a: 'We accept Visa, MasterCard, American Express, PayPal, and bank transfers. All payments are processed securely via our payment partners.' },
    { q: 'How do I download my invoice?', a: 'Go to Invoices in the sidebar, find the invoice you need, and click the download icon. Invoices are available in PDF format.' },
    { q: 'Can I get a refund?', a: 'Refunds are processed within 5-7 business days. Contact our support team with your order ID and reason for the refund request.' },
    { q: 'How do I upgrade my plan?', a: 'Go to Settings > Billing and click "Upgrade Plan". You can compare plans and select the one that best fits your needs.' },
  ],
  Orders: [
    { q: 'How do I track an order?', a: 'Go to Orders in the sidebar and search for the order by ID or customer name. Click on the order to see detailed tracking information.' },
    { q: 'How do I process a return?', a: 'Navigate to the order details, click "Create Return", select the items to return, and choose the refund method.' },
    { q: 'Can I export order data?', a: 'Yes! On the Orders list page, click the Export button to download your orders in CSV or Excel format.' },
    { q: 'How do I send order confirmation emails?', a: 'Order confirmation emails are sent automatically. Go to Settings > Emails to customize the email templates.' },
  ],
  Products: [
    { q: 'How do I add a new product?', a: 'Go to Products > Add Product from the sidebar. Fill in the product name, description, price, stock, and upload images, then save.' },
    { q: 'Can I bulk import products?', a: 'Yes! On the Products page, click "Import" and upload a CSV file with your product data following our template format.' },
    { q: 'How do I manage product variants?', a: 'When creating or editing a product, scroll to the Variants section. Add attributes like size and color, then configure pricing and stock per variant.' },
    { q: 'How do I set up product categories?', a: 'Go to Category in the sidebar to create, edit, and organize your product categories into a hierarchical structure.' },
  ],
  Technical: [
    { q: 'What browsers are supported?', a: 'Larkon Admin supports the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using Chrome.' },
    { q: 'Is my data backed up?', a: 'Yes, all data is automatically backed up daily to secure cloud storage. You can also trigger manual backups from Settings > System.' },
    { q: 'How do I connect payment gateways?', a: 'Go to Settings > Payments and click "Add Payment Gateway". Select your provider (Stripe, PayPal, etc.) and follow the integration steps.' },
    { q: 'How do I set up shipping rules?', a: 'Navigate to Settings > Shipping to configure shipping zones, rates, and carrier integrations for your store.' },
  ],
};

export default function FaqsPage() {
  const [activeCategory, setActiveCategory] = useState('General');
  const [openId, setOpenId] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const faqs = FAQS[activeCategory] || [];
  const filtered = search
    ? Object.values(FAQS).flat().filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : faqs;

  return (
    <div>
      {/* Hero */}
      <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: 'none' }}>
        <div className="card-body py-5 text-center text-white">
          <iconify-icon icon="solar:question-circle-bold-duotone" style={{ fontSize: '56px', color: '#ff6c2f', display: 'block', marginBottom: '16px' }}></iconify-icon>
          <h2 className="fw-bold mb-2">Frequently Asked Questions</h2>
          <p className="mb-4 opacity-75">Find answers to the most common questions</p>
          <div className="d-flex justify-content-center">
            <div className="position-relative" style={{ width: '100%', maxWidth: '480px' }}>
              <input type="text" className="form-control form-control-lg rounded-pill" placeholder="Search FAQs..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '48px' }} />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#94a3b8' }}></iconify-icon>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Categories sidebar */}
        {!search && (
          <div className="col-lg-3">
            <div className="card">
              <div className="card-header"><h6 className="card-title mb-0">Categories</h6></div>
              <div className="card-body p-0">
                {FAQ_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setOpenId(null); }}
                    className="d-flex align-items-center justify-content-between w-100 px-4 py-3 border-0 border-bottom text-start"
                    style={{ background: activeCategory === cat ? '#fff7f4' : 'transparent', color: activeCategory === cat ? '#ff6c2f' : '#334155', fontWeight: activeCategory === cat ? 700 : 400, fontSize: '14px', cursor: 'pointer' }}>
                    {cat}
                    <span className="badge" style={{ background: activeCategory === cat ? '#ff6c2f' : '#e2e8f0', color: activeCategory === cat ? '#fff' : '#64748b' }}>
                      {(FAQS[cat] || []).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ accordion */}
        <div className={search ? 'col-12' : 'col-lg-9'}>
          {search && (
            <div className="mb-3 text-muted" style={{ fontSize: '14px' }}>
              <iconify-icon icon="solar:magnifer-linear" className="me-1"></iconify-icon>
              Showing {filtered.length} results for &quot;{search}&quot;
              <button className="btn btn-link btn-sm p-0 ms-2" onClick={() => setSearch('')}>Clear</button>
            </div>
          )}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">{search ? 'Search Results' : activeCategory}</h5>
              <span className="badge bg-primary-subtle text-primary">{filtered.length} questions</span>
            </div>
            <div className="card-body p-0">
              {filtered.map((faq, i) => (
                <div key={i} className="border-bottom">
                  <button
                    onClick={() => setOpenId(openId === i ? null : i)}
                    className="d-flex align-items-center justify-content-between w-100 text-start px-4 py-3 border-0 bg-transparent"
                    style={{ fontWeight: 600, fontSize: '15px', color: openId === i ? '#ff6c2f' : '#1e293b', cursor: 'pointer' }}
                  >
                    <span>{faq.q}</span>
                    <iconify-icon icon={openId === i ? 'solar:minus-circle-bold' : 'solar:add-circle-bold'} style={{ fontSize: '20px', flexShrink: 0, marginLeft: '12px', color: openId === i ? '#ff6c2f' : '#94a3b8' }}></iconify-icon>
                  </button>
                  {openId === i && (
                    <div className="px-4 pb-4 text-muted" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-5 text-muted">
                  <iconify-icon icon="solar:question-circle-bold-duotone" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}></iconify-icon>
                  No FAQs found. Try a different search term.
                </div>
              )}
            </div>
          </div>

          {/* Still need help? */}
          <div className="card mt-3">
            <div className="card-body d-flex align-items-center gap-4 flex-wrap">
              <iconify-icon icon="solar:headphones-round-sound-bold-duotone" style={{ fontSize: '48px', color: '#ff6c2f', flexShrink: 0 }}></iconify-icon>
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-1">Still have questions?</h6>
                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Can't find the answer you're looking for? Contact our support team.</p>
              </div>
              <a href="#!" className="btn btn-primary d-flex align-items-center gap-2">
                <iconify-icon icon="solar:chat-round-bold-duotone"></iconify-icon> Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
