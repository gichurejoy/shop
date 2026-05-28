'use client';

import React, { useState } from 'react';

export default function SmsSettingsPage() {
  const [provider, setProvider] = useState('twilio');
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title">SMS Provider Setup</h4>
            <div className="form-check form-switch mb-0">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={enabled} 
                onChange={e => setEnabled(e.target.checked)} 
                style={{ width: '36px', height: '20px', cursor: 'pointer' }}
              />
              <label className="form-check-label ms-2 fw-medium">Enable SMS Notifications</label>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <label className="form-label fw-medium">Select Provider</label>
              <div className="d-flex gap-3 mt-2">
                <div 
                  className={`border rounded p-3 text-center cursor-pointer ${provider === 'twilio' ? 'border-primary bg-primary-subtle' : 'bg-light'}`}
                  style={{ flex: 1, cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setProvider('twilio')}
                >
                  <iconify-icon icon="solar:smartphone-2-bold-duotone" className={`fs-32 ${provider === 'twilio' ? 'text-primary' : 'text-muted'}`}></iconify-icon>
                  <div className="fw-bold mt-2">Twilio</div>
                </div>
                <div 
                  className={`border rounded p-3 text-center cursor-pointer ${provider === 'messagebird' ? 'border-primary bg-primary-subtle' : 'bg-light'}`}
                  style={{ flex: 1, cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setProvider('messagebird')}
                >
                  <iconify-icon icon="solar:letter-opened-bold-duotone" className={`fs-32 ${provider === 'messagebird' ? 'text-primary' : 'text-muted'}`}></iconify-icon>
                  <div className="fw-bold mt-2">MessageBird</div>
                </div>
                <div 
                  className={`border rounded p-3 text-center cursor-pointer ${provider === 'aws_sns' ? 'border-primary bg-primary-subtle' : 'bg-light'}`}
                  style={{ flex: 1, cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setProvider('aws_sns')}
                >
                  <iconify-icon icon="solar:server-square-bold-duotone" className={`fs-32 ${provider === 'aws_sns' ? 'text-primary' : 'text-muted'}`}></iconify-icon>
                  <div className="fw-bold mt-2">AWS SNS</div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            <h5 className="fs-15 mb-3">API Credentials</h5>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Account SID / API Key</label>
                <input type="text" className="form-control" placeholder="Enter Account SID" defaultValue="AC8172be..." />
              </div>
              <div className="col-12">
                <label className="form-label">Auth Token / API Secret</label>
                <input type="password" className="form-control" placeholder="Enter Auth Token" defaultValue="************" />
              </div>
              <div className="col-12">
                <label className="form-label">Sender Phone Number / Sender ID</label>
                <input type="text" className="form-control" placeholder="+1 (555) 123-4567" defaultValue="+1234567890" />
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-top text-end">
              <button className="btn btn-outline-primary me-2">Test Connection</button>
              <button className="btn btn-primary">Save Settings</button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-header border-bottom">
            <h4 className="card-title">SMS Templates</h4>
          </div>
          <div className="card-body">
            <div className="d-flex flex-column gap-3">
              
              <div className="border rounded p-3 bg-light-subtle">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold fs-14">Order Confirmed</span>
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" defaultChecked />
                  </div>
                </div>
                <textarea className="form-control fs-13" rows={3} defaultValue="Hi {{customer.first_name}}, thanks for your order #{{order.number}}! We'll notify you when it ships." />
              </div>

              <div className="border rounded p-3 bg-light-subtle">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold fs-14">Order Shipped</span>
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" defaultChecked />
                  </div>
                </div>
                <textarea className="form-control fs-13" rows={3} defaultValue="Good news! Order #{{order.number}} has shipped. Track it here: {{order.tracking_url}}" />
              </div>

              <div className="border rounded p-3 bg-light-subtle">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold fs-14">Out for Delivery</span>
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" />
                  </div>
                </div>
                <textarea className="form-control fs-13" rows={3} defaultValue="Your order #{{order.number}} is out for delivery today!" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
