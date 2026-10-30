'use client';

const SECTIONS = [
  {
    id: 'info-collect',
    icon: 'solar:database-bold-duotone',
    color: '#3b82f6',
    title: '1. Information We Collect',
    content: [
      { subtitle: '1.1 Personal Information', text: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team. This includes your name, email address, postal address, phone number, and payment information.' },
      { subtitle: '1.2 Usage Data', text: 'We automatically collect certain information about how you use our platform, including pages visited, features used, time spent on pages, error logs, and clickstream data. This helps us improve our services and user experience.' },
      { subtitle: '1.3 Device Information', text: 'We collect information about the device you use to access our service, including device type, operating system, browser type and version, IP address, and unique device identifiers.' },
    ]
  },
  {
    id: 'info-use',
    icon: 'solar:shield-check-bold-duotone',
    color: '#22c55e',
    title: '2. How We Use Your Information',
    content: [
      { subtitle: '2.1 Service Delivery', text: 'We use your information to provide, maintain, and improve our services; process transactions; send transactional and promotional communications; and respond to your comments and questions.' },
      { subtitle: '2.2 Analytics & Improvement', text: 'We analyze usage patterns to understand how our services are used, identify trends, and improve the functionality and performance of our platform.' },
      { subtitle: '2.3 Legal Compliance', text: 'We may use your information to comply with applicable laws and regulations, respond to legal requests, protect our rights, and prevent fraudulent or illegal activity.' },
    ]
  },
  {
    id: 'info-share',
    icon: 'solar:share-bold-duotone',
    color: '#f59e0b',
    title: '3. Information Sharing',
    content: [
      { subtitle: '3.1 Service Providers', text: 'We may share your information with third-party vendors and service providers that perform services on our behalf, such as payment processing, data analysis, email delivery, hosting, and customer service.' },
      { subtitle: '3.2 Business Transfers', text: 'If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.' },
      { subtitle: '3.3 Legal Requirements', text: 'We may disclose your information if required by law, government request, court order, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.' },
    ]
  },
  {
    id: 'data-security',
    icon: 'solar:lock-password-bold-duotone',
    color: '#ef4444',
    title: '4. Data Security',
    content: [
      { subtitle: '4.1 Security Measures', text: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include encryption, access controls, and regular security audits.' },
      { subtitle: '4.2 Data Retention', text: 'We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we securely delete or anonymize it.' },
    ]
  },
  {
    id: 'your-rights',
    icon: 'solar:user-check-bold-duotone',
    color: '#8b5cf6',
    title: '5. Your Rights & Choices',
    content: [
      { subtitle: '5.1 Access & Correction', text: 'You have the right to access and update your personal information at any time through your account settings. If you believe any information is incorrect, you may request a correction.' },
      { subtitle: '5.2 Deletion', text: 'You may request deletion of your personal information by contacting us. Note that some information may be retained for legal compliance, dispute resolution, or enforcement of our agreements.' },
      { subtitle: '5.3 Marketing Opt-Out', text: 'You may opt out of receiving promotional communications from us by following the unsubscribe instructions in any marketing email we send you, or by updating your notification preferences in account settings.' },
    ]
  },
  {
    id: 'cookies',
    icon: 'solar:cookie-bold-duotone',
    color: '#06b6d4',
    title: '6. Cookies & Tracking',
    content: [
      { subtitle: '6.1 Cookie Usage', text: 'We use cookies and similar tracking technologies to collect and store information about your interactions with our platform. Cookies help us remember your preferences, analyze traffic, and personalize your experience.' },
      { subtitle: '6.2 Cookie Control', text: 'Most web browsers allow you to control cookies through browser settings. However, disabling cookies may affect certain features and functionality of our services.' },
    ]
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div>
      {/* Header */}
      <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', border: 'none' }}>
        <div className="card-body py-5 text-center text-white">
          <iconify-icon icon="solar:shield-bold-duotone" style={{ fontSize: '56px', color: '#ff6c2f', display: 'block', marginBottom: '16px' }}></iconify-icon>
          <h2 className="fw-bold mb-2">Privacy Policy</h2>
          <p className="opacity-75 mb-1">Last updated: May 20, 2024 · Effective: June 1, 2024</p>
          <p className="opacity-75 mb-0" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '14px' }}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use our services.
          </p>
        </div>
      </div>

      <div className="row g-3">
        {/* Table of Contents */}
        <div className="col-lg-3">
          <div className="card sticky-top" style={{ top: '80px' }}>
            <div className="card-header"><h6 className="card-title mb-0">Table of Contents</h6></div>
            <div className="card-body p-0">
              {SECTIONS.map((s, i) => (
                <a key={i} href={`#${s.id}`} className="d-flex align-items-center gap-2 px-4 py-3 text-decoration-none border-bottom" style={{ color: '#334155', fontSize: '13px', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#ff6c2f'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#334155'}>
                  <iconify-icon icon={s.icon} style={{ color: s.color, fontSize: '16px', flexShrink: 0 }}></iconify-icon>
                  <span>{s.title.replace(/^\d+\. /, '')}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-lg-9">
          {/* Introduction */}
          <div className="card mb-3">
            <div className="card-body">
              <p className="text-muted mb-0" style={{ fontSize: '15px', lineHeight: '1.8' }}>
                Welcome to Waveron Admin. We are committed to protecting your personal information and your right to privacy.
                This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our platform.
                Please read this policy carefully. If you disagree with its terms, please discontinue use of our service.
              </p>
            </div>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id} className="card mb-3">
              <div className="card-header d-flex align-items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: section.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <iconify-icon icon={section.icon} style={{ fontSize: '22px', color: section.color }}></iconify-icon>
                </div>
                <h5 className="card-title mb-0">{section.title}</h5>
              </div>
              <div className="card-body">
                {section.content.map((item, j) => (
                  <div key={j} className={j < section.content.length - 1 ? 'mb-4' : ''}>
                    <h6 className="fw-bold text-dark mb-2">{item.subtitle}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.8' }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div className="card">
            <div className="card-body d-flex align-items-center gap-4 flex-wrap">
              <iconify-icon icon="solar:letter-bold-duotone" style={{ fontSize: '48px', color: '#ff6c2f', flexShrink: 0 }}></iconify-icon>
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-1">Questions about our Privacy Policy?</h6>
                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Contact our data protection team at <a href="mailto:privacy@example.com" className="text-primary">privacy@example.com</a></p>
              </div>
              <a href="mailto:privacy@example.com" className="btn btn-primary d-flex align-items-center gap-2">
                <iconify-icon icon="solar:letter-bold-duotone"></iconify-icon> Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
