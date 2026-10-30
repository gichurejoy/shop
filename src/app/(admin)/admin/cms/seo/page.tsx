'use client';

import React, { useState, useEffect } from 'react';
import { getCmsSeoSettings, saveCmsSeoSettings } from '../../../../actions';
import type { CmsSeoSettings } from '../../../../../lib/cms';

export default function AdvancedSEO() {
  const [seo, setSeo] = useState<CmsSeoSettings>({
    siteTitleTemplate: '{page_title} | Store',
    defaultMetaDescription: '',
    googleAnalyticsId: '',
    robotsTxt: 'User-agent: *\nAllow: /'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    setLoading(true);
    const data = await getCmsSeoSettings();
    setSeo(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveCmsSeoSettings(seo);
    setSaving(false);
    alert('SEO Settings saved!');
  };

  if (loading) return <div className="p-5 text-center text-muted">Loading...</div>;

  return (
    <div className="row g-4">
      <div className="col-xl-6">
        <div className="card h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:global-bold-duotone" style={{ color: '#3b82f6', fontSize: '20px' }}></iconify-icon>
              General SEO Settings
            </h5>
          </div>
          <div className="card-body">
            <p className="text-muted mb-4">Configure global meta tags and analytics tracking codes.</p>
            
            <div className="mb-3">
              <label className="form-label fw-medium">Site Title Template</label>
              <input 
                type="text" 
                className="form-control" 
                value={seo.siteTitleTemplate} 
                onChange={e => setSeo({ ...seo, siteTitleTemplate: e.target.value })} 
                placeholder="{page_title} | Your Brand" 
              />
              <div className="form-text text-muted fs-12">Use <code>{'{page_title}'}</code> as a placeholder.</div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Default Meta Description</label>
              <textarea 
                className="form-control" 
                rows={3} 
                value={seo.defaultMetaDescription} 
                onChange={e => setSeo({ ...seo, defaultMetaDescription: e.target.value })} 
                placeholder="A fallback description used if a page doesn't have one."
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Google Analytics ID</label>
              <input 
                type="text" 
                className="form-control" 
                value={seo.googleAnalyticsId} 
                onChange={e => setSeo({ ...seo, googleAnalyticsId: e.target.value })} 
                placeholder="G-XXXXXXXXXX" 
              />
            </div>
            
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave} disabled={saving}>
              <iconify-icon icon="solar:diskette-bold"></iconify-icon> Save Settings
            </button>
          </div>
        </div>
      </div>

      <div className="col-xl-6">
        <div className="card h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <iconify-icon icon="solar:code-file-bold-duotone" style={{ color: '#ff6c2f', fontSize: '20px' }}></iconify-icon>
              Robots.txt Editor
            </h5>
          </div>
          <div className="card-body d-flex flex-column">
            <p className="text-muted mb-3">The robots.txt file tells search engine crawlers which URLs they can access on your site. Use caution when editing this file.</p>
            
            <div className="alert alert-warning border-warning-subtle text-warning-emphasis d-flex align-items-start gap-2 fs-13 mb-3">
              <iconify-icon icon="solar:danger-triangle-bold" className="fs-18 flex-shrink-0 mt-1"></iconify-icon>
              <div>Incorrectly editing your robots.txt file can completely block search engines from crawling your site, causing a massive drop in traffic.</div>
            </div>

            <div className="flex-grow-1 mb-3 position-relative">
              <textarea 
                className="form-control font-monospace bg-dark text-light border-0 w-100" 
                style={{ height: '300px', padding: '16px', fontSize: '13px', lineHeight: '1.6', resize: 'vertical' }}
                value={seo.robotsTxt}
                onChange={e => setSeo({ ...seo, robotsTxt: e.target.value })}
              ></textarea>
            </div>
            
            <div className="d-flex gap-2">
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave} disabled={saving}>
                <iconify-icon icon="solar:diskette-bold"></iconify-icon> Save robots.txt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
