'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

type TaxRegion = {
  id: string;
  region: string;
  country: string;
  rate: string;
  digitalRate: string;
  status: boolean;
};

export default function TaxesPage() {
  const [taxes, setTaxes] = useState<TaxRegion[]>([]);
  const [taxCalculation, setTaxCalculation] = useState('inclusive');
  const [roundAtSubtotal, setRoundAtSubtotal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    country: '',
    region: '',
    rate: '',
    digitalRate: '',
  });

  const loadTaxData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.taxes.get();
      setTaxes(res.taxes || []);
      setTaxCalculation(res.calculation || 'inclusive');
      setRoundAtSubtotal(res.roundAtSubtotal ?? true);
    } catch (err: any) {
      toast.error('Failed to load tax settings: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxData();
  }, []);

  const persistSettings = async (newTaxes: TaxRegion[], calc: string, round: boolean) => {
    setSaving(true);
    try {
      await apiClient.taxes.save({
        calculation: calc,
        roundAtSubtotal: round,
        taxes: newTaxes,
      });
      toast.success('Tax configuration saved to MySQL database!');
    } catch (err: any) {
      toast.error('Failed to save taxes: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const toggleRegionStatus = (id: string) => {
    const updated = taxes.map((t) => (t.id === id ? { ...t, status: !t.status } : t));
    setTaxes(updated);
    persistSettings(updated, taxCalculation, roundAtSubtotal);
  };

  const handleDeleteRegion = (id: string) => {
    const updated = taxes.filter((t) => t.id !== id);
    setTaxes(updated);
    persistSettings(updated, taxCalculation, roundAtSubtotal);
    toast.success('Region removed');
  };

  const handleAddRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.country.trim() || !formData.rate) {
      toast.error('Country and rate are required.');
      return;
    }

    const newRegion: TaxRegion = {
      id: `tax-${Date.now()}`,
      country: formData.country.trim(),
      region: formData.region.trim() || '*',
      rate: `${formData.rate}%`,
      digitalRate: `${formData.digitalRate || formData.rate}%`,
      status: true,
    };

    const updated = [...taxes, newRegion];
    setTaxes(updated);
    setShowAddForm(false);
    setFormData({ country: '', region: '', rate: '', digitalRate: '' });
    persistSettings(updated, taxCalculation, roundAtSubtotal);
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading tax settings from database...</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h4 className="card-title mb-1 fw-bold">Tax Jurisdictions &amp; Calculation Rules</h4>
            <p className="text-muted fs-13 mb-0">Configure regional sales tax rates and calculation formulas in MySQL.</p>
          </div>
          <Link href="/admin/finance/reports" className="btn btn-outline-secondary btn-sm">
            View Tax Liability Report →
          </Link>
        </div>

        {/* Global Settings */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header border-bottom bg-transparent py-3">
            <h5 className="card-title mb-0 fw-semibold">Global Tax Calculation</h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-4 align-items-center">
              <div className="col-md-6">
                <label className="form-label fw-semibold text-dark">Price Display &amp; Calculation</label>
                <div className="d-flex flex-column gap-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="taxCalculation"
                      id="inclusive"
                      checked={taxCalculation === 'inclusive'}
                      onChange={() => {
                        setTaxCalculation('inclusive');
                        persistSettings(taxes, 'inclusive', roundAtSubtotal);
                      }}
                    />
                    <label className="form-check-label text-dark fw-medium" htmlFor="inclusive">
                      Tax Inclusive (All prices shown already include taxes - European/UK standard)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="taxCalculation"
                      id="exclusive"
                      checked={taxCalculation === 'exclusive'}
                      onChange={() => {
                        setTaxCalculation('exclusive');
                        persistSettings(taxes, 'exclusive', roundAtSubtotal);
                      }}
                    />
                    <label className="form-check-label text-dark fw-medium" htmlFor="exclusive">
                      Tax Exclusive (Tax is added at checkout - US/Canada standard)
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-md-6 border-start-md">
                <label className="form-label fw-semibold text-dark">Tax Rounding</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="roundTaxes"
                    checked={roundAtSubtotal}
                    onChange={(e) => {
                      setRoundAtSubtotal(e.target.checked);
                      persistSettings(taxes, taxCalculation, e.target.checked);
                    }}
                  />
                  <label className="form-check-label text-dark" htmlFor="roundTaxes">
                    Round tax amounts at subtotal level, rather than line-by-line
                  </label>
                </div>
                <div className="form-text text-muted mt-2">
                  Changes save automatically to the database upon selection.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Add Region Form (No Popups!) */}
        {showAddForm && (
          <div className="card shadow-sm border border-primary mb-4 bg-primary bg-opacity-10">
            <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center py-3">
              <h5 className="card-title mb-0 fw-bold text-primary">Add New Tax Jurisdiction</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAddForm(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleAddRegion}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label fw-medium text-dark fs-13">Country *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. United Kingdom"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium text-dark fs-13">Region / State (* for all)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. England or *"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium text-dark fs-13">Standard Rate (%) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="e.g. 20"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium text-dark fs-13">Digital Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="e.g. 20"
                      value={formData.digitalRate}
                      onChange={(e) => setFormData({ ...formData, digitalRate: e.target.value })}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                      Save Jurisdiction to MySQL
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Regional Rates Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div>
              <h5 className="card-title mb-1 fw-semibold">Regional Tax Rates</h5>
              <p className="text-muted fs-12 mb-0">Applied to physical products and digital goods based on shipping destination.</p>
            </div>
            {!showAddForm && (
              <button
                type="button"
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                onClick={() => setShowAddForm(true)}
              >
                <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Tax Region
              </button>
            )}
          </div>
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0 text-nowrap">
              <thead className="bg-light-subtle">
                <tr>
                  <th>Country</th>
                  <th>Region / State</th>
                  <th>Standard Rate</th>
                  <th>Digital Goods Rate</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {taxes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      No tax regions defined. Click "Add Tax Region" above.
                    </td>
                  </tr>
                ) : (
                  taxes.map((t) => (
                    <tr key={t.id}>
                      <td className="fw-semibold text-dark">{t.country}</td>
                      <td>{t.region}</td>
                      <td>
                        <span className="badge bg-light text-dark border">{t.rate}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">{t.digitalRate}</span>
                      </td>
                      <td>
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={t.status}
                            onChange={() => toggleRegionStatus(t.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-soft-danger"
                          onClick={() => handleDeleteRegion(t.id)}
                          title="Delete Region"
                        >
                          <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-16"></iconify-icon>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
