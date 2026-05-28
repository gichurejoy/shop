'use client';

import React, { useState, useEffect } from 'react';
import { getCmsPages, saveCmsPage, deleteCmsPage, CmsPage } from '../../../../actions';
import { TipTapEditor } from '../../../../../components/cms/TipTapEditor';
import Link from 'next/link';

export default function StaticPages() {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [editId, setEditId] = useState<string | undefined>();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    const data = await getCmsPages();
    setPages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openCreate = () => {
    setEditId(undefined);
    setTitle('');
    setSlug('');
    setContent('');
    setStatus('Draft');
    setSeoTitle('');
    setSeoDescription('');
    setView('edit');
  };

  const openEdit = (page: CmsPage) => {
    setEditId(page.id);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setStatus(page.status);
    setSeoTitle(page.seoTitle || '');
    setSeoDescription(page.seoDescription || '');
    setView('edit');
  };

  const handleSave = async (publishStatus?: 'Published' | 'Draft') => {
    if (!title || !slug) return alert('Title and Slug are required.');
    setSaving(true);
    const finalStatus = publishStatus || status;
    await saveCmsPage({
      id: editId,
      title,
      slug,
      content,
      status: finalStatus,
      seoTitle,
      seoDescription
    });
    setSaving(false);
    setView('list');
    fetchPages();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      await deleteCmsPage(id);
      fetchPages();
    }
  };

  if (view === 'edit') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1050, background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{ height: '60px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px' }}>
          <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            <iconify-icon icon="solar:arrow-left-linear" style={{ fontSize: '20px' }}></iconify-icon> Pages
          </button>
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
          <input
            type="text"
            placeholder="Page Title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '20px', fontWeight: 600, color: '#0f172a', outline: 'none', flex: 1 }}
          />
          <button onClick={() => handleSave('Draft')} disabled={saving} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 500, cursor: 'pointer' }}>
            Save Draft
          </button>
          <button onClick={() => handleSave('Published')} disabled={saving} style={{ padding: '8px 24px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            Publish
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Editor */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>URL Slug</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="about-us"
                    style={{ flex: 1, border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '4px', outline: 'none' }}
                  />
                </div>
              </div>
              <TipTapEditor value={content} onChange={setContent} />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: '350px', background: '#fff', borderLeft: '1px solid #e2e8f0', overflowY: 'auto' }}>
            <div style={{ padding: '24px' }}>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#0f172a' }}>Publishing</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#475569', marginBottom: '4px', display: 'block' }}>Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr style={{ borderColor: '#e2e8f0', margin: '0 -24px 24px -24px' }} />

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#0f172a' }}>SEO Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#475569', marginBottom: '4px', display: 'block' }}>Meta Title</label>
                    <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="Default: Page Title" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#475569', marginBottom: '4px', display: 'block' }}>Meta Description</label>
                    <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)} placeholder="Description for search engines..." style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', height: '80px' }} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title">Static Pages</h4>
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreate}>
              <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Create New Page
            </button>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center p-4">Loading pages...</div>
            ) : pages.length === 0 ? (
              <div className="text-center p-4 text-muted">No pages found. Create one!</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Page Title</th>
                      <th>URL Slug</th>
                      <th>Status</th>
                      <th>Last Modified</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id}>
                        <td><a href="#!" onClick={() => openEdit(page)} className="fw-medium text-dark">{page.title}</a></td>
                        <td>
                          <Link href={`/${page.slug}`} target="_blank" className="text-primary fs-13">/{page.slug}</Link>
                        </td>
                        <td>
                          <span className={`badge px-2 py-1 fs-12 ${page.status === 'Published' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                            {page.status}
                          </span>
                        </td>
                        <td className="text-muted fs-13">{new Date(page.lastModified).toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-soft-primary btn-sm" onClick={() => openEdit(page)}><iconify-icon icon="solar:pen-2-broken" className="fs-18 align-middle"></iconify-icon></button>
                            <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(page.id)}><iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18 align-middle"></iconify-icon></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
