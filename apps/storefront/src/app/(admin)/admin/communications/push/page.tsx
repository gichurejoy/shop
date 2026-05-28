'use client';

import React, { useState } from 'react';

export default function PushNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [audience, setAudience] = useState('all');

  return (
    <div className="row">
      <div className="col-lg-7">
        <div className="card">
          <div className="card-header border-bottom">
            <h4 className="card-title">Send Push Notification</h4>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-medium">Notification Title</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Flash Sale Alert!" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                maxLength={40}
              />
              <div className="text-end text-muted fs-12 mt-1">{title.length}/40</div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Message Body</label>
              <textarea 
                className="form-control" 
                rows={3} 
                placeholder="Get 50% off all sneakers for the next 2 hours." 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                maxLength={100}
              />
              <div className="text-end text-muted fs-12 mt-1">{message.length}/100</div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Target URL (Optional)</label>
              <input 
                type="url" 
                className="form-control" 
                placeholder="https://yoursite.com/sale" 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
              />
            </div>

            <hr className="my-4" />

            <div className="mb-4">
              <label className="form-label fw-medium">Target Audience</label>
              <select className="form-select" value={audience} onChange={e => setAudience(e.target.value)}>
                <option value="all">All Subscribers (45,210 users)</option>
                <option value="active">Active within last 30 days (12,400 users)</option>
                <option value="abandoned">Abandoned Cart Users (834 users)</option>
                <option value="vip">VIP Customers (2,100 users)</option>
              </select>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted fs-13">
                <iconify-icon icon="solar:info-circle-bold-duotone" className="align-middle me-1"></iconify-icon>
                Notifications are sent immediately.
              </div>
              <button 
                className="btn btn-primary d-flex align-items-center gap-2" 
                disabled={!title || !message}
              >
                <iconify-icon icon="solar:plain-2-bold-duotone" className="fs-18"></iconify-icon> Send Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="card bg-light-subtle border-0">
          <div className="card-header bg-transparent border-bottom-0 pb-0">
            <h4 className="card-title text-center text-muted">Live Preview</h4>
          </div>
          <div className="card-body d-flex justify-content-center pt-2">
            
            {/* iOS Style Preview */}
            <div 
              style={{ 
                width: '320px', 
                height: '500px', 
                background: '#000', 
                borderRadius: '32px', 
                padding: '12px',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              {/* Wallpaper */}
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', 
                  borderRadius: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Time */}
                <div className="text-white text-center fw-semibold mt-3" style={{ fontSize: '42px', lineHeight: '1' }}>09:41</div>
                <div className="text-white text-center opacity-75 fs-14 mb-4">Wednesday, October 12</div>

                {/* Notification Bubble */}
                <div 
                  style={{ 
                    background: 'rgba(255,255,255,0.85)', 
                    backdropFilter: 'blur(10px)', 
                    borderRadius: '16px',
                    padding: '12px',
                    margin: '0 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <div className="bg-primary rounded text-white d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px' }}>
                      <iconify-icon icon="solar:shop-bold-duotone" className="fs-12"></iconify-icon>
                    </div>
                    <span className="fs-12 fw-semibold text-dark opacity-75" style={{ letterSpacing: '0.5px' }}>STOREFRONT</span>
                    <span className="fs-12 text-muted ms-auto">now</span>
                  </div>
                  <div className="fw-bold text-dark" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                    {title || 'Notification Title'}
                  </div>
                  <div className="text-dark opacity-75 mt-1" style={{ fontSize: '13px', lineHeight: '1.3' }}>
                    {message || 'This is how your push notification will appear on a locked screen.'}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
