'use client';

import Link from 'next/link';

const HELP_TOPICS = [
  { icon: 'solar:settings-bold-duotone', color: '#3b82f6', title: 'Account & Settings', count: 24, desc: 'Manage your profile, security, notifications and billing.' },
  { icon: 'solar:cart-large-4-bold-duotone', color: '#22c55e', title: 'Orders & Shipping', count: 18, desc: 'Track orders, manage returns, and shipping information.' },
  { icon: 'solar:bill-list-bold-duotone', color: '#f59e0b', title: 'Billing & Payments', count: 31, desc: 'Invoices, payment methods, refunds and subscriptions.' },
  { icon: 'solar:box-bold-duotone', color: '#8b5cf6', title: 'Products & Inventory', count: 15, desc: 'Add products, manage stock levels and categories.' },
  { icon: 'solar:users-group-two-rounded-bold-duotone', color: '#ef4444', title: 'Customers & CRM', count: 22, desc: 'Customer profiles, segments and support history.' },
  { icon: 'solar:chart-bold-duotone', color: '#06b6d4', title: 'Reports & Analytics', count: 19, desc: 'Sales reports, traffic analytics and data exports.' },
];

const POPULAR = [
  'How do I reset my password?',
  'How can I track my order?',
  'How do I issue a refund?',
  'Can I change my subscription plan?',
  'How do I add a new product?',
  'Where can I view my invoices?',
];

const GUIDES = [
  { title: 'Getting Started Guide', time: '5 min read', icon: 'solar:play-circle-bold-duotone', color: '#ff6c2f' },
  { title: 'Setting Up Your Store', time: '8 min read', icon: 'solar:shop-bold-duotone', color: '#3b82f6' },
  { title: 'Managing Orders', time: '6 min read', icon: 'solar:bag-smile-bold-duotone', color: '#22c55e' },
  { title: 'Understanding Analytics', time: '10 min read', icon: 'solar:chart-2-bold-duotone', color: '#8b5cf6' },
];

export default function HelpCenterPage() {
  return (
    <div>
      {/* Hero search */}
      <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #ff6c2f 0%, #ff9a6c 100%)', border: 'none' }}>
        <div className="card-body py-5 text-center text-white">
          <h2 className="fw-bold mb-2">How can we help you?</h2>
          <p className="mb-4 opacity-75">Search our knowledge base or browse topics below</p>
          <div className="d-flex justify-content-center">
            <div className="position-relative" style={{ width: '100%', maxWidth: '500px' }}>
              <input type="text" className="form-control form-control-lg rounded-pill" placeholder="Search for articles, guides, FAQs..." style={{ paddingLeft: '48px', paddingRight: '120px' }} />
              <iconify-icon icon="solar:magnifer-linear" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#94a3b8' }}></iconify-icon>
              <button className="btn btn-primary rounded-pill" style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px' }}>Search</button>
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-center gap-3 flex-wrap">
            <span className="text-white-75 opacity-75" style={{ fontSize: '13px' }}>Popular:</span>
            {['Password Reset', 'Refund Policy', 'Shipping', 'Billing'].map(t => (
              <a key={t} href="#!" className="badge bg-white text-dark rounded-pill text-decoration-none" style={{ fontSize: '12px' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Topic cards */}
      <h5 className="fw-bold mb-3">Browse Help Topics</h5>
      <div className="row g-3 mb-4">
        {HELP_TOPICS.map(t => (
          <div key={t.title} className="col-md-6 col-xl-4">
            <a href="#!" className="text-decoration-none">
              <div className="card h-100 card-hover" style={{ transition: 'box-shadow 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = ''}>
                <div className="card-body">
                  <div className="d-flex align-items-start gap-3">
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: t.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <iconify-icon icon={t.icon} style={{ fontSize: '26px', color: t.color }}></iconify-icon>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1 text-dark">{t.title}</h6>
                      <p className="text-muted mb-2" style={{ fontSize: '13px' }}>{t.desc}</p>
                      <span className="text-primary" style={{ fontSize: '13px', fontWeight: 600 }}>{t.count} articles</span>
                    </div>
                    <iconify-icon icon="solar:arrow-right-linear" style={{ color: '#94a3b8', fontSize: '18px', marginTop: '2px' }}></iconify-icon>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Popular Questions */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header"><h5 className="card-title mb-0">Popular Questions</h5></div>
            <div className="card-body p-0">
              {POPULAR.map((q, i) => (
                <a key={i} href="#!" className="d-flex align-items-center gap-3 px-4 py-3 text-decoration-none border-bottom" style={{ color: '#334155', fontSize: '14px' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#f8fafc'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = ''}>
                  <iconify-icon icon="solar:question-circle-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px', flexShrink: 0 }}></iconify-icon>
                  {q}
                  <iconify-icon icon="solar:arrow-right-linear" style={{ color: '#94a3b8', marginLeft: 'auto' }}></iconify-icon>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Guides & Tutorials */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header"><h5 className="card-title mb-0">Guides & Tutorials</h5></div>
            <div className="card-body">
              {GUIDES.map((g, i) => (
                <div key={i} className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: g.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <iconify-icon icon={g.icon} style={{ fontSize: '22px', color: g.color }}></iconify-icon>
                  </div>
                  <div className="flex-grow-1">
                    <a href="#!" className="text-decoration-none fw-medium text-dark d-block" style={{ fontSize: '14px' }}>{g.title}</a>
                    <span className="text-muted" style={{ fontSize: '12px' }}>{g.time}</span>
                  </div>
                  <a href="#!" className="btn btn-sm btn-outline-primary">Read</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact support */}
      <div className="card mt-3">
        <div className="card-body py-4 text-center">
          <h5 className="fw-bold mb-1">Still need help?</h5>
          <p className="text-muted mb-3">Our support team is available 24/7 to assist you</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a href="#!" className="btn btn-primary d-flex align-items-center gap-2">
              <iconify-icon icon="solar:chat-round-bold-duotone"></iconify-icon> Live Chat
            </a>
            <a href="#!" className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <iconify-icon icon="solar:letter-bold-duotone"></iconify-icon> Email Support
            </a>
            <Link href="/admin/apps/todo" className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <iconify-icon icon="solar:phone-bold-duotone"></iconify-icon> FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
