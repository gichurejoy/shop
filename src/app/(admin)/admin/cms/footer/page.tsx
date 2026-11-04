'use client';

import React, { useState, useEffect } from 'react';
import { getCmsFooter, saveCmsFooter } from '@/app/actions';
import { CmsFooterSettings, DEFAULT_FOOTER_SETTINGS, CmsFooterColumn, CmsFooterLink } from '@/lib/cms';
import { toast } from 'sonner';
import { Footer } from '@/components/Footer';

export default function FooterSettingsPage() {
  const [settings, setSettings] = useState<CmsFooterSettings>(DEFAULT_FOOTER_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'brand' | 'columns' | 'social' | 'style'>('brand');

  useEffect(() => {
    getCmsFooter().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveCmsFooter(settings);
      toast.success('Footer settings saved and published to storefront!');
    } catch {
      toast.error('Failed to save footer settings.');
    } finally {
      setSaving(false);
    }
  };

  // Helper to update top-level field
  const update = (patch: Partial<CmsFooterSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  // Helper to update social links
  const updateSocial = (network: keyof CmsFooterSettings['socialLinks'], val: string) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: val,
      },
    }));
  };

  // Column management
  const updateColumnTitle = (colIdx: number, newTitle: string) => {
    const nextCols = [...settings.columns];
    nextCols[colIdx].title = newTitle;
    update({ columns: nextCols });
  };

  const addColumn = () => {
    if (settings.columns.length >= 4) {
      toast.error('Maximum 4 footer columns supported.');
      return;
    }
    const newCol: CmsFooterColumn = {
      id: `col-${Date.now()}`,
      title: 'New Column',
      links: [
        { id: `l-${Date.now()}-1`, label: 'Link 1', url: '/products' },
      ],
    };
    update({ columns: [...settings.columns, newCol] });
  };

  const removeColumn = (colIdx: number) => {
    const nextCols = settings.columns.filter((_, idx) => idx !== colIdx);
    update({ columns: nextCols });
  };

  const addLink = (colIdx: number) => {
    const nextCols = [...settings.columns];
    nextCols[colIdx].links.push({
      id: `l-${Date.now()}`,
      label: 'New Link',
      url: '/products',
    });
    update({ columns: nextCols });
  };

  const updateLink = (colIdx: number, linkIdx: number, field: 'label' | 'url', val: string) => {
    const nextCols = [...settings.columns];
    nextCols[colIdx].links[linkIdx][field] = val;
    update({ columns: nextCols });
  };

  const removeLink = (colIdx: number, linkIdx: number) => {
    const nextCols = [...settings.columns];
    nextCols[colIdx].links = nextCols[colIdx].links.filter((_, idx) => idx !== linkIdx);
    update({ columns: nextCols });
  };

  // Payment badge toggle
  const togglePaymentMethod = (method: string) => {
    const current = settings.paymentMethods || [];
    const next = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    update({ paymentMethods: next });
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm p-5 text-center">
        <div className="spinner-border text-primary mx-auto mb-3" role="status" />
        <p className="text-muted mb-0">Loading Footer Settings...</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {/* ── Page Header ── */}
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h4 className="card-title mb-1 fw-bold text-dark">Storefront Footer Settings</h4>
              <p className="text-muted fs-13 mb-0">
                Customize brand information, contact details, navigation link columns, social media, and payment badges visible across all pages.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5"
              >
                <iconify-icon icon="solar:eye-broken" className="fs-16"></iconify-icon> View Storefront
              </a>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-2 fw-semibold"
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" /> Saving...
                  </>
                ) : (
                  <>
                    <iconify-icon icon="solar:diskette-bold" className="fs-16"></iconify-icon> Save & Publish Footer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Visual Preview ── */}
      <div className="col-12">
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="card-header bg-light py-2 px-3 border-bottom d-flex justify-content-between align-items-center">
            <span className="fs-12 fw-bold text-uppercase text-muted tracking-wider flex items-center gap-1.5">
              <span>🖥</span> Live Footer Preview (Updates In Realtime)
            </span>
            <span className="badge bg-success-subtle text-success fs-11">Storefront Sync Active</span>
          </div>
          <div className="card-body p-0 overflow-hidden">
            <Footer settings={settings} />
          </div>
        </div>
      </div>

      {/* ── Settings Form Tabs ── */}
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom p-0">
            <ul className="nav nav-tabs nav-tabs-custom border-bottom-0">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link px-4 py-3 fw-semibold ${activeTab === 'brand' ? 'active text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                  onClick={() => setActiveTab('brand')}
                >
                  <iconify-icon icon="solar:shop-2-bold" className="align-middle me-1.5 fs-18"></iconify-icon> Brand & Contact Info
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link px-4 py-3 fw-semibold ${activeTab === 'columns' ? 'active text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                  onClick={() => setActiveTab('columns')}
                >
                  <iconify-icon icon="solar:list-bold" className="align-middle me-1.5 fs-18"></iconify-icon> Navigation Columns & Links ({settings.columns.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link px-4 py-3 fw-semibold ${activeTab === 'social' ? 'active text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                  onClick={() => setActiveTab('social')}
                >
                  <iconify-icon icon="solar:share-circle-bold" className="align-middle me-1.5 fs-18"></iconify-icon> Socials & Payment Badges
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link px-4 py-3 fw-semibold ${activeTab === 'style' ? 'active text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                  onClick={() => setActiveTab('style')}
                >
                  <iconify-icon icon="solar:pallete-2-bold" className="align-middle me-1.5 fs-18"></iconify-icon> Colors & Theme
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-4">
            {/* TAB 1: Brand & Contact */}
            {activeTab === 'brand' && (
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark fs-13">Store / Brand Name</label>
                  <input
                    type="text"
                    value={settings.brandName}
                    onChange={(e) => update({ brandName: e.target.value })}
                    placeholder="e.g. Apex Hardware Supplies"
                    className="form-control"
                  />
                  <div className="form-text fs-12">Displayed as the main brand title if no logo image is set.</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark fs-13">Logo URL (Optional)</label>
                  <input
                    type="url"
                    value={settings.logoUrl || ''}
                    onChange={(e) => update({ logoUrl: e.target.value })}
                    placeholder="https://..."
                    className="form-control"
                  />
                  <div className="form-text fs-12">Paste image URL or leave empty to use the text brand name.</div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-dark fs-13">Brand Tagline / Short Description</label>
                  <textarea
                    rows={2}
                    value={settings.tagline}
                    onChange={(e) => update({ tagline: e.target.value })}
                    placeholder="Brief 1-2 sentence description of your business and value proposition..."
                    className="form-control"
                  />
                </div>

                <hr className="my-2" />
                <h5 className="fs-14 fw-bold text-dark mb-0">Customer Contact & Location</h5>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark fs-13">Customer Support Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail || ''}
                    onChange={(e) => update({ contactEmail: e.target.value })}
                    placeholder="support@yourstore.com"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark fs-13">Support Phone Number</label>
                  <input
                    type="text"
                    value={settings.contactPhone || ''}
                    onChange={(e) => update({ contactPhone: e.target.value })}
                    placeholder="+1 (800) 555-0199"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark fs-13">Physical Store Address</label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => update({ address: e.target.value })}
                    placeholder="100 Commercial Blvd, Building 4"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark fs-13">Store / Operating Hours</label>
                  <input
                    type="text"
                    value={settings.businessHours || ''}
                    onChange={(e) => update({ businessHours: e.target.value })}
                    placeholder="Mon - Sat: 8:00 AM - 7:00 PM"
                    className="form-control"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-dark fs-13">Copyright Notice Text</label>
                  <input
                    type="text"
                    value={settings.copyrightText}
                    onChange={(e) => update({ copyrightText: e.target.value })}
                    placeholder="© 2026 Your Store Name. All rights reserved."
                    className="form-control"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Navigation Columns */}
            {activeTab === 'columns' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fs-15 fw-bold text-dark mb-1">Footer Link Columns</h5>
                    <p className="text-muted fs-13 mb-0">Organize your footer into up to 4 categorized link sections.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addColumn}
                    disabled={settings.columns.length >= 4}
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5"
                  >
                    <iconify-icon icon="solar:add-circle-bold"></iconify-icon> + Add Column
                  </button>
                </div>

                <div className="row g-4">
                  {settings.columns.map((col, colIdx) => (
                    <div key={col.id} className="col-md-4">
                      <div className="card border bg-light p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-secondary-subtle text-secondary fs-11">Column {colIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeColumn(colIdx)}
                            className="btn btn-link text-danger p-0 fs-12 text-decoration-none"
                            title="Delete Column"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mb-3">
                          <label className="form-label fs-12 fw-semibold text-muted mb-1">Column Title</label>
                          <input
                            type="text"
                            value={col.title}
                            onChange={(e) => updateColumnTitle(colIdx, e.target.value)}
                            className="form-control form-control-sm fw-bold"
                            placeholder="e.g. Products, Support, Company"
                          />
                        </div>

                        <label className="form-label fs-12 fw-semibold text-muted mb-1">Links</label>
                        <div className="space-y-2 mb-3">
                          {col.links.map((link, linkIdx) => (
                            <div key={link.id} className="d-flex align-items-center gap-1.5 mb-1.5">
                              <input
                                type="text"
                                value={link.label}
                                onChange={(e) => updateLink(colIdx, linkIdx, 'label', e.target.value)}
                                className="form-control form-control-sm"
                                placeholder="Label"
                                style={{ width: '45%' }}
                              />
                              <input
                                type="text"
                                value={link.url}
                                onChange={(e) => updateLink(colIdx, linkIdx, 'url', e.target.value)}
                                className="form-control form-control-sm"
                                placeholder="/url"
                                style={{ width: '45%' }}
                              />
                              <button
                                type="button"
                                onClick={() => removeLink(colIdx, linkIdx)}
                                className="btn btn-outline-danger btn-sm p-1 d-flex align-items-center"
                                title="Remove Link"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => addLink(colIdx)}
                          className="btn btn-white btn-sm border w-100 fs-12 mt-auto text-primary fw-semibold"
                        >
                          + Add Link
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Socials & Payments */}
            {activeTab === 'social' && (
              <div className="row g-4">
                <div className="col-12">
                  <h5 className="fs-15 fw-bold text-dark mb-1">Social Media Profiles</h5>
                  <p className="text-muted fs-13 mb-3">Only social networks with a URL configured will be displayed in the footer.</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-semibold">Facebook URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.facebook || ''}
                    onChange={(e) => updateSocial('facebook', e.target.value)}
                    placeholder="https://facebook.com/yourbrand"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-semibold">Instagram URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.instagram || ''}
                    onChange={(e) => updateSocial('instagram', e.target.value)}
                    placeholder="https://instagram.com/yourbrand"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-semibold">Twitter / X URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.twitter || ''}
                    onChange={(e) => updateSocial('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourbrand"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-semibold">YouTube URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.youtube || ''}
                    onChange={(e) => updateSocial('youtube', e.target.value)}
                    placeholder="https://youtube.com/@yourbrand"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-semibold">LinkedIn URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.linkedin || ''}
                    onChange={(e) => updateSocial('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/yourbrand"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-13 fw-semibold">TikTok URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.tiktok || ''}
                    onChange={(e) => updateSocial('tiktok', e.target.value)}
                    placeholder="https://tiktok.com/@yourbrand"
                    className="form-control"
                  />
                </div>

                <hr className="my-2" />
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h5 className="fs-15 fw-bold text-dark mb-1">Accepted Payment Method Badges</h5>
                      <p className="text-muted fs-13 mb-0">Select which payment methods to showcase at the bottom of the footer.</p>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={settings.showPaymentBadges}
                        onChange={(e) => update({ showPaymentBadges: e.target.checked })}
                        id="showBadgesSwitch"
                        style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                      />
                      <label className="form-check-label fw-semibold ms-2" htmlFor="showBadgesSwitch">
                        Show Badges
                      </label>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    {[
                      { id: 'visa', label: 'VISA Card' },
                      { id: 'mastercard', label: 'Mastercard' },
                      { id: 'mpesa', label: 'M-PESA Mobile Money' },
                      { id: 'paypal', label: 'PayPal' },
                      { id: 'applepay', label: 'Apple Pay' },
                      { id: 'cash', label: 'Cash on Delivery' },
                    ].map((pm) => {
                      const isSelected = (settings.paymentMethods || []).includes(pm.id);
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => togglePaymentMethod(pm.id)}
                          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                        >
                          {isSelected ? '✓ ' : '+ '} {pm.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Styling & Colors */}
            {activeTab === 'style' && (
              <div className="row g-4">
                <div className="col-12">
                  <h5 className="fs-15 fw-bold text-dark mb-1">Footer Styling & Color Palette</h5>
                  <p className="text-muted fs-13 mb-3">Easily match the footer to your store theme.</p>
                </div>

                {/* Color presets */}
                <div className="col-12">
                  <label className="form-label fs-13 fw-semibold text-muted">Theme Presets</label>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {[
                      { name: 'Dark Slate (Hardware / Tech)', bg: '#1E293B', text: '#94A3B8', accent: '#FF6C2F' },
                      { name: 'Midnight Charcoal', bg: '#0F172A', text: '#94A3B8', accent: '#3B82F6' },
                      { name: 'Forest Green (Grocery / Eco)', bg: '#14532D', text: '#DCFCE7', accent: '#4ADE80' },
                      { name: 'Atelier Bronze (Luxury)', bg: '#3D2817', text: '#E5D6C5', accent: '#D4A574' },
                      { name: 'Pure Black (Fashion Minimal)', bg: '#000000', text: '#A1A1AA', accent: '#FFFFFF' },
                      { name: 'Clean Light Theme', bg: '#F8FAFC', text: '#475569', accent: '#2563EB' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => update({ backgroundColor: preset.bg, textColor: preset.text, accentColor: preset.accent })}
                        className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                      >
                        <span className="w-3 h-3 rounded-circle border" style={{ backgroundColor: preset.bg }} />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label fs-13 fw-semibold">Footer Background Color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="color"
                      value={settings.backgroundColor || '#1E293B'}
                      onChange={(e) => update({ backgroundColor: e.target.value })}
                      className="form-control form-control-color"
                      style={{ width: '48px', height: '38px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={settings.backgroundColor || ''}
                      onChange={(e) => update({ backgroundColor: e.target.value })}
                      className="form-control font-monospace"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label fs-13 fw-semibold">Body & Links Text Color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="color"
                      value={settings.textColor || '#94A3B8'}
                      onChange={(e) => update({ textColor: e.target.value })}
                      className="form-control form-control-color"
                      style={{ width: '48px', height: '38px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={settings.textColor || ''}
                      onChange={(e) => update({ textColor: e.target.value })}
                      className="form-control font-monospace"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label fs-13 fw-semibold">Accent / Hover Color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="color"
                      value={settings.accentColor || '#FF6C2F'}
                      onChange={(e) => update({ accentColor: e.target.value })}
                      className="form-control form-control-color"
                      style={{ width: '48px', height: '38px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={settings.accentColor || ''}
                      onChange={(e) => update({ accentColor: e.target.value })}
                      className="form-control font-monospace"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
