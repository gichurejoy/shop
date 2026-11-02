'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

type GatewayField = {
  key: string;
  label: string;
  type: string;
  value: string;
};

type Gateway = {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  description: string;
  enabled: boolean;
  fields: GatewayField[];
};

export default function GatewaysPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [activeGateway, setActiveGateway] = useState<Gateway | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadGateways = async () => {
    try {
      setLoading(true);
      const res = await apiClient.gateways.get();
      setGateways(res.gateways || []);
      if (res.gateways && res.gateways.length > 0) {
        setActiveGateway(res.gateways[0]);
      }
    } catch (err: any) {
      toast.error('Failed to load gateways: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGateways();
  }, []);

  const toggleStatus = async (id: string) => {
    const updated = gateways.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g));
    setGateways(updated);
    if (activeGateway?.id === id) {
      setActiveGateway({ ...activeGateway, enabled: !activeGateway.enabled });
    }
    try {
      await apiClient.gateways.save(updated);
      toast.success(`Gateway status updated successfully!`);
    } catch (err: any) {
      toast.error('Failed to update status: ' + (err.message || 'Error'));
    }
  };

  const handleFieldChange = (key: string, newValue: string) => {
    if (!activeGateway) return;
    const updatedFields = activeGateway.fields.map((f) => (f.key === key ? { ...f, value: newValue } : f));
    const updatedGateway = { ...activeGateway, fields: updatedFields };
    setActiveGateway(updatedGateway);
    setGateways(gateways.map((g) => (g.id === activeGateway.id ? updatedGateway : g)));
  };

  const saveSettings = async () => {
    if (!activeGateway) return;
    setSaving(true);
    try {
      const updated = gateways.map((g) => (g.id === activeGateway.id ? activeGateway : g));
      await apiClient.gateways.save(updated);
      toast.success(`Configuration for "${activeGateway.name}" saved to database!`);
    } catch (err: any) {
      toast.error('Failed to save settings: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading payment gateways from database...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 className="card-title mb-1 fw-bold">Payment Methods &amp; Gateways</h4>
          <p className="text-muted fs-13 mb-0">Configure payment providers and credentials stored in MySQL.</p>
        </div>
        <Link href="/admin/finance/transactions" className="btn btn-outline-secondary btn-sm">
          View Transactions Register →
        </Link>
      </div>

      <div className="row g-4">
        {/* Left: Gateways List */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header border-bottom bg-transparent py-3">
              <h5 className="card-title mb-0 fw-semibold">Available Providers</h5>
            </div>
            <div className="card-body p-3">
              <div className="d-flex flex-column gap-3">
                {gateways.map((gateway) => {
                  const isSelected = activeGateway?.id === gateway.id;
                  return (
                    <div
                      key={gateway.id}
                      className={`p-3 rounded border transition-all cursor-pointer ${
                        isSelected ? 'border-primary bg-primary bg-opacity-10' : 'bg-light-subtle'
                      }`}
                      onClick={() => setActiveGateway(gateway)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded bg-white shadow-xs d-flex align-items-center justify-content-center border"
                            style={{ width: '44px', height: '44px' }}
                          >
                            <iconify-icon icon={gateway.icon} style={{ fontSize: '24px', color: gateway.iconColor }}></iconify-icon>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold text-dark">{gateway.name}</h6>
                            <span className={`badge ${gateway.enabled ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} fs-11`}>
                              {gateway.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>

                        <div className="form-check form-switch mb-0" onClick={(e) => e.stopPropagation()}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={gateway.enabled}
                            onChange={() => toggleStatus(gateway.id)}
                            style={{ cursor: 'pointer', width: '32px', height: '18px' }}
                          />
                        </div>
                      </div>
                      <p className="text-muted fs-12 mb-0">{gateway.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Inline Credentials Editor (No Modal Popup!) */}
        <div className="col-lg-6">
          {activeGateway ? (
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center gap-2">
                  <iconify-icon icon={activeGateway.icon} style={{ fontSize: '22px', color: activeGateway.iconColor }}></iconify-icon>
                  <h5 className="card-title mb-0 fw-semibold">{activeGateway.name} Credentials</h5>
                </div>
                <span className={`badge ${activeGateway.enabled ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} fs-12`}>
                  {activeGateway.enabled ? 'Active on Checkout' : 'Disabled'}
                </span>
              </div>
              <div className="card-body p-4">
                <p className="text-muted fs-13 mb-4">{activeGateway.description}</p>

                <div className="d-flex flex-column gap-3 mb-4">
                  {activeGateway.fields.map((field) => (
                    <div key={field.key}>
                      <label className="form-label fw-medium text-dark fs-13 mb-1">{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          className="form-select"
                          value={field.value}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        >
                          <option value="sandbox">Sandbox / Test Mode</option>
                          <option value="live">Live Production</option>
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          className="form-control"
                          value={field.value}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-light rounded text-muted fs-12 border mb-4">
                  <iconify-icon icon="solar:lock-bold" className="text-success me-1 align-middle"></iconify-icon>
                  API secrets are encrypted and stored securely in MySQL settings.
                </div>

                <button
                  type="button"
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={saveSettings}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Saving to MySQL...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="solar:diskette-bold" className="fs-18"></iconify-icon>
                      Save {activeGateway.name} Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0 h-100 d-flex align-items-center justify-content-center p-5 text-center text-muted">
              Select a payment gateway from the left to configure its API keys.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
