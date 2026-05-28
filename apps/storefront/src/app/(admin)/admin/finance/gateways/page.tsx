'use client';

import React, { useState } from 'react';

type Gateway = {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  description: string;
  enabled: boolean;
  fields: { key: string; label: string; type: string; value: string }[];
};

const INITIAL_GATEWAYS: Gateway[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    icon: 'fa6-brands:stripe',
    iconColor: '#635bff',
    description: 'Accept credit cards, debit cards, and Apple/Google Pay directly on your store.',
    enabled: true,
    fields: [
      { key: 'pk', label: 'Publishable Key', type: 'text', value: 'pk_test_51Mz...' },
      { key: 'sk', label: 'Secret Key', type: 'password', value: 'sk_test_51Mz...' },
      { key: 'webhook', label: 'Webhook Secret', type: 'password', value: 'whsec_...' },
    ]
  },
  {
    id: 'paypal',
    name: 'PayPal Checkout',
    icon: 'fa6-brands:paypal',
    iconColor: '#003087',
    description: 'Let customers pay with their PayPal account balance or saved cards.',
    enabled: false,
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text', value: '' },
      { key: 'secret', label: 'Client Secret', type: 'password', value: '' },
      { key: 'mode', label: 'Environment', type: 'select', value: 'sandbox' },
    ]
  },
  {
    id: 'mpesa',
    name: 'M-Pesa Express',
    icon: 'solar:smartphone-bold-duotone',
    iconColor: '#22c55e',
    description: 'Enable STK push mobile money payments for customers in East Africa.',
    enabled: true,
    fields: [
      { key: 'consumerKey', label: 'Consumer Key', type: 'text', value: 'b29xZ...' },
      { key: 'consumerSecret', label: 'Consumer Secret', type: 'password', value: 'vK9L...' },
      { key: 'shortcode', label: 'Business Shortcode', type: 'text', value: '174379' },
      { key: 'passkey', label: 'Passkey', type: 'password', value: 'bfb27...' },
    ]
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    icon: 'solar:box-bold-duotone',
    iconColor: '#64748b',
    description: 'Allow customers to pay in cash when the delivery arrives.',
    enabled: true,
    fields: [
      { key: 'instructions', label: 'Instructions for Customer', type: 'text', value: 'Please have the exact amount ready.' },
    ]
  }
];

export default function GatewaysPage() {
  const [gateways, setGateways] = useState(INITIAL_GATEWAYS);
  const [activeGateway, setActiveGateway] = useState<Gateway | null>(null);

  const toggleStatus = (id: string) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
  };

  const handleFieldChange = (key: string, newValue: string) => {
    if (!activeGateway) return;
    setActiveGateway({
      ...activeGateway,
      fields: activeGateway.fields.map(f => f.key === key ? { ...f, value: newValue } : f)
    });
  };

  const saveSettings = () => {
    if (!activeGateway) return;
    setGateways(prev => prev.map(g => g.id === activeGateway.id ? activeGateway : g));
    setActiveGateway(null);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card mb-4">
          <div className="card-header border-bottom">
            <h4 className="card-title mb-0">Payment Methods</h4>
          </div>
          <div className="card-body">
            <div className="alert alert-info fs-13 mb-4 border-0 bg-info-subtle text-info-emphasis">
              <iconify-icon icon="solar:info-circle-bold-duotone" className="me-2 align-middle"></iconify-icon>
              Configure the payment gateways available to your customers during checkout. You can enable multiple providers.
            </div>

            <div className="row g-4">
              {gateways.map(gateway => (
                <div key={gateway.id} className="col-md-6 col-xl-4">
                  <div className={`card h-100 border ${gateway.enabled ? 'border-primary' : 'border-light'}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-md rounded bg-light d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                            <iconify-icon icon={gateway.icon} style={{ fontSize: '28px', color: gateway.iconColor }}></iconify-icon>
                          </div>
                          <div>
                            <h5 className="mb-1">{gateway.name}</h5>
                            <span className={`badge ${gateway.enabled ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} fs-11`}>
                              {gateway.enabled ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                        <div className="form-check form-switch mb-0">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            checked={gateway.enabled} 
                            onChange={() => toggleStatus(gateway.id)} 
                            style={{ cursor: 'pointer', width: '32px', height: '18px' }}
                          />
                        </div>
                      </div>
                      <p className="text-muted fs-13 mb-4" style={{ minHeight: '40px' }}>
                        {gateway.description}
                      </p>
                      <button 
                        className="btn btn-light w-100 fw-medium"
                        onClick={() => setActiveGateway(gateway)}
                      >
                        <iconify-icon icon="solar:settings-bold-duotone" className="me-1 align-middle"></iconify-icon> Manage Settings
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {activeGateway && (
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow-lg m-3" style={{ width: '100%', maxWidth: '500px' }}>
            <div className="card-header border-bottom d-flex justify-content-between align-items-center bg-light-subtle">
              <h5 className="card-title mb-0">{activeGateway.name} Settings</h5>
              <button type="button" className="btn-close" onClick={() => setActiveGateway(null)}></button>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3 mb-4">
                {activeGateway.fields.map(field => (
                  <div key={field.key}>
                    <label className="form-label fw-medium text-dark">{field.label}</label>
                    {field.type === 'select' ? (
                      <select 
                        className="form-select" 
                        value={field.value}
                        onChange={e => handleFieldChange(field.key, e.target.value)}
                      >
                        <option value="sandbox">Sandbox (Testing)</option>
                        <option value="live">Live (Production)</option>
                      </select>
                    ) : (
                      <input 
                        type={field.type} 
                        className="form-control" 
                        value={field.value}
                        onChange={e => handleFieldChange(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between pt-3 border-top">
                <button className="btn btn-outline-primary btn-sm">Test Connection</button>
                <div className="d-flex gap-2">
                  <button className="btn btn-light" onClick={() => setActiveGateway(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={saveSettings}>Save API Keys</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
