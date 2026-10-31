'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [metaTitle, setMetaTitle] = useState('Waveron Atelier | High Luxury Goods & Fine Curations');
  const [metaKeywords, setMetaKeywords] = useState('luxury, jewelry, fashion, atelier, fine crafts');
  const [theme, setTheme] = useState('Default');
  const [layout, setLayout] = useState('Default');
  const [description, setDescription] = useState(
    'A destination for handcrafted luxury goods, curated timeless jewelry, and bespoke craftsmanship.'
  );

  const [storeName, setStoreName] = useState('Waveron Luxury Store');
  const [ownerName, setOwnerName] = useState('Atelier Director');
  const [phone, setPhone] = useState('+254 700 000 000');
  const [email, setEmail] = useState('concierge@waveron.com');
  const [address, setAddress] = useState('Waveron House, Riverside Drive, Westlands');
  const [zipCode, setZipCode] = useState('00100');
  const [city, setCity] = useState('Nairobi');
  const [country, setCountry] = useState('Kenya');

  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(16);
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await apiClient.settings.get();
        if (res && res.settings) {
          const s = res.settings;
          if (s.metaTitle !== undefined) setMetaTitle(s.metaTitle);
          if (s.metaKeywords !== undefined) setMetaKeywords(s.metaKeywords);
          if (s.theme !== undefined) setTheme(s.theme);
          if (s.layout !== undefined) setLayout(s.layout);
          if (s.description !== undefined) setDescription(s.description);
          if (s.storeName !== undefined) setStoreName(s.storeName);
          if (s.ownerName !== undefined) setOwnerName(s.ownerName);
          if (s.phone !== undefined) setPhone(s.phone);
          if (s.email !== undefined) setEmail(s.email);
          if (s.address !== undefined) setAddress(s.address);
          if (s.zipCode !== undefined) setZipCode(s.zipCode);
          if (s.city !== undefined) setCity(s.city);
          if (s.country !== undefined) setCountry(s.country);
          if (s.currency !== undefined) setCurrency(s.currency);
          if (s.taxRate !== undefined) setTaxRate(Number(s.taxRate));
          if (s.allowGuestCheckout !== undefined) setAllowGuestCheckout(Boolean(s.allowGuestCheckout));
        }
      } catch (err: any) {
        console.warn('Could not load settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        metaTitle,
        metaKeywords,
        theme,
        layout,
        description,
        storeName,
        ownerName,
        phone,
        email,
        address,
        zipCode,
        city,
        country,
        currency,
        taxRate,
        allowGuestCheckout,
      };
      await apiClient.settings.update(payload);
      toast.success('Store settings saved to MySQL database successfully!');
    } catch (err: any) {
      toast.error('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      {/* General Settings */}
      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title d-flex align-items-center gap-1">
                <iconify-icon className="text-primary fs-20" icon="solar:settings-bold-duotone"></iconify-icon>
                General Settings
              </h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6">
                  <label className="form-label" htmlFor="meta-name">Meta Title</label>
                  <input
                    className="form-control"
                    id="meta-name"
                    placeholder="Title"
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label" htmlFor="meta-tag">Meta Tag Keywords</label>
                  <input
                    className="form-control"
                    id="meta-tag"
                    placeholder="Enter keywords comma separated"
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label" htmlFor="themes">Store Theme</label>
                  <select
                    className="form-control"
                    id="themes"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <option value="Default">Default (Luxury Minimal)</option>
                    <option value="Dark">Dark Atelier</option>
                    <option value="Minimalist">Minimalist Pure</option>
                    <option value="High Contrast">High Contrast</option>
                  </select>
                </div>
                <div className="col-lg-6">
                  <label className="form-label" htmlFor="layout">Layout</label>
                  <select
                    className="form-control"
                    id="layout"
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                  >
                    <option value="Default">Default Luxury</option>
                    <option value="Fashion">Fashion &amp; Apparel</option>
                    <option value="Jewelry">Fine Jewelry &amp; Watches</option>
                    <option value="Electronics">Electronics &amp; Lifestyle</option>
                  </select>
                </div>
                <div className="col-lg-12">
                  <label className="form-label" htmlFor="description">Store Meta Description</label>
                  <textarea
                    className="form-control bg-light-subtle"
                    id="description"
                    placeholder="Type store description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Settings */}
      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title d-flex align-items-center gap-1">
                <iconify-icon className="text-primary fs-20" icon="solar:shop-2-bold-duotone"></iconify-icon>
                Store &amp; Contact Settings
              </h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6">
                  <label className="form-label" htmlFor="store-name">Store Name *</label>
                  <input
                    className="form-control"
                    id="store-name"
                    required
                    placeholder="Enter name"
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label" htmlFor="owner-name">Store Owner Full Name</label>
                  <input
                    className="form-control"
                    id="owner-name"
                    placeholder="Full name"
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label" htmlFor="schedule-number">Contact Phone Number</label>
                  <input
                    className="form-control"
                    id="schedule-number"
                    placeholder="Phone number"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label" htmlFor="schedule-email">Support &amp; Billing Email</label>
                  <input
                    className="form-control"
                    id="schedule-email"
                    placeholder="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-lg-12">
                  <label className="form-label" htmlFor="address">Physical Headquarters Address</label>
                  <textarea
                    className="form-control bg-light-subtle"
                    id="address"
                    placeholder="Type address"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>
                <div className="col-lg-4">
                  <label className="form-label" htmlFor="your-zipcode">Postal / Zip-Code</label>
                  <input
                    className="form-control"
                    id="your-zipcode"
                    placeholder="zip-code"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label" htmlFor="choices-city">City</label>
                  <input
                    className="form-control"
                    id="choices-city"
                    placeholder="City"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label" htmlFor="choices-country">Country</label>
                  <input
                    className="form-control"
                    id="choices-country"
                    placeholder="Country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Checkout Rules */}
      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title d-flex align-items-center gap-1">
                <iconify-icon className="text-primary fs-20" icon="solar:wallet-money-bold-duotone"></iconify-icon>
                Currency, Tax &amp; Checkout Rules
              </h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-4">
                  <label className="form-label">Store Currency</label>
                  <select
                    className="form-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="KES">KES (KSh)</option>
                  </select>
                </div>
                <div className="col-lg-4">
                  <label className="form-label">Standard Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label">Allow Guest Checkout</label>
                  <div className="d-flex gap-3 align-items-center mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="guest-yes"
                        name="guestCheckout"
                        checked={allowGuestCheckout === true}
                        onChange={() => setAllowGuestCheckout(true)}
                      />
                      <label className="form-check-label" htmlFor="guest-yes">Yes</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="guest-no"
                        name="guestCheckout"
                        checked={allowGuestCheckout === false}
                        onChange={() => setAllowGuestCheckout(false)}
                      />
                      <label className="form-check-label" htmlFor="guest-no">No</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="text-end mb-4">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn btn-outline-secondary me-2"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn btn-success d-inline-flex align-items-center gap-1"
        >
          {saving ? (
            <span className="spinner-border spinner-border-sm" role="status"></span>
          ) : (
            <iconify-icon icon="solar:disk-bold-duotone"></iconify-icon>
          )}
          {saving ? 'Saving to Database...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
