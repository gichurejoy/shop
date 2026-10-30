'use client';

import React, { useState, useEffect } from 'react';
import { getCmsAnnouncementBar, saveCmsAnnouncementBar } from '../../../../actions';
import type { CmsAnnouncementBar } from '../../../../../lib/cms';

export default function AnnouncementBarManager() {
  const [bar, setBar] = useState<CmsAnnouncementBar>({
    visible: false,
    message: '',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    link: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBar();
  }, []);

  const fetchBar = async () => {
    setLoading(true);
    const data = await getCmsAnnouncementBar();
    setBar(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveCmsAnnouncementBar(bar);
    setSaving(false);
    alert('Announcement Bar saved!');
  };

  if (loading) return <div className="p-5 text-center text-muted">Loading...</div>;

  return (
    <div className="row justify-content-center">
      <div className="col-xl-8">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:bell-bing-bold-duotone" style={{ color: '#ffc107', fontSize: '20px' }}></iconify-icon>
              Announcement Bar
            </h5>
            <div className="form-check form-switch fs-15 mb-0">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="barVisible"
                checked={bar.visible}
                onChange={e => setBar({ ...bar, visible: e.target.checked })}
              />
              <label className="form-check-label fw-bold" htmlFor="barVisible">Enable Bar</label>
            </div>
          </div>
          <div className="card-body">
            <p className="text-muted mb-4">Show a prominent message at the very top of your store for sales, shipping notices, or announcements.</p>
            
            {/* Live Preview */}
            <div className="mb-4">
              <label className="form-label fw-bold text-muted fs-12 text-uppercase">Live Preview</label>
              <div 
                className="rounded text-center py-2 px-3 fw-medium fs-14"
                style={{ 
                  backgroundColor: bar.backgroundColor || '#000', 
                  color: bar.textColor || '#fff',
                  opacity: bar.visible ? 1 : 0.5,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                {bar.message || 'Your announcement message will appear here.'}
              </div>
              {!bar.visible && <div className="text-danger fs-12 mt-1">Preview mode (Currently hidden on the live site)</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Message Text</label>
              <input 
                type="text" 
                className="form-control" 
                value={bar.message} 
                onChange={e => setBar({ ...bar, message: e.target.value })} 
                placeholder="e.g. Free shipping on all orders over $50!" 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Link URL (Optional)</label>
              <input 
                type="text" 
                className="form-control" 
                value={bar.link || ''} 
                onChange={e => setBar({ ...bar, link: e.target.value })} 
                placeholder="https://" 
              />
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-medium">Background Color</label>
                <div className="d-flex align-items-center gap-2">
                  <input 
                    type="color" 
                    className="form-control form-control-color p-1" 
                    value={bar.backgroundColor} 
                    onChange={e => setBar({ ...bar, backgroundColor: e.target.value })} 
                  />
                  <input 
                    type="text" 
                    className="form-control text-uppercase font-monospace" 
                    value={bar.backgroundColor} 
                    onChange={e => setBar({ ...bar, backgroundColor: e.target.value })} 
                  />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Text Color</label>
                <div className="d-flex align-items-center gap-2">
                  <input 
                    type="color" 
                    className="form-control form-control-color p-1" 
                    value={bar.textColor} 
                    onChange={e => setBar({ ...bar, textColor: e.target.value })} 
                  />
                  <input 
                    type="text" 
                    className="form-control text-uppercase font-monospace" 
                    value={bar.textColor} 
                    onChange={e => setBar({ ...bar, textColor: e.target.value })} 
                  />
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary d-flex align-items-center gap-2 w-100 justify-content-center py-2" onClick={handleSave} disabled={saving}>
              <iconify-icon icon="solar:diskette-bold"></iconify-icon> {saving ? 'Saving...' : 'Save Announcement Bar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
