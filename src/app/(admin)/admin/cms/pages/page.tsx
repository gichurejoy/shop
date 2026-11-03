'use client';

import React, { useState, useEffect } from 'react';
import { getCmsPages, saveCmsPage, deleteCmsPage } from '../../../../actions';
import type { CmsPage } from '@/lib/cms';
import { TipTapEditor } from '../../../../../components/cms/TipTapEditor';
import Link from 'next/link';
import { toast } from 'sonner';

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
    if (!title || !slug) {
      toast.error('Title and Slug are required.');
      return;
    }
    setSaving(true);
    try {
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
      toast.success(`Page "${title}" saved successfully!`);
      setView('list');
      fetchPages();
    } catch {
      toast.error('Failed to save page.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCmsPage(id);
      toast.success('Page deleted successfully.');
      fetchPages();
    } catch {
      toast.error('Failed to delete page.');
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
          {slug && (
            <Link
              href={`/admin/cms/builder?page=${slug}`}
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                background: '#ff6c2f',
                color: '#fff',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
              }}
            >
              <span>🎨</span> Open in Visual Builder
            </Link>
          )}
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
  const systemPages = [
    { title: 'Homepage', slug: 'home', path: '/', desc: 'Main store landing, hero banner, product grids, and reviews.' },
    { title: 'About Us', slug: 'about', path: '/about', desc: 'Atelier craftsmanship, ethical sourcing, story, and milestones.' },
    { title: 'Care Guide', slug: 'care-guide', path: '/care-guide', desc: 'Jewelry & knitwear maintenance, cleaning steps, FAQs.' },
    { title: 'Lookbook', slug: 'lookbook', path: '/lookbook', desc: 'High-fashion editorial galleries and season showcases.' },
    { title: 'VIP Membership', slug: 'membership', path: '/membership', desc: 'Exclusive client tier benefits, private concierge stylist.' },
  ];

  return (
    <div className="row g-4">
      {/* ── System Core Pages Card ── */}
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
            <div>
              <h4 className="card-title mb-1 text-dark fw-bold">Storefront Visual Builder Pages</h4>
              <p className="text-muted fs-13 mb-0">Visually design and customize every page of your store with on-canvas editing and blocks.</p>
            </div>
            <Link href="/admin/cms/builder" className="btn btn-warning d-flex align-items-center gap-2 fw-semibold">
              <iconify-icon icon="solar:pallete-2-bold" className="fs-18"></iconify-icon> Open Visual Builder
            </Link>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Store Page</th>
                    <th>Live URL</th>
                    <th>Layout & Content</th>
                    <th>Type</th>
                    <th className="text-end">Visual Editor</th>
                  </tr>
                </thead>
                <tbody>
                  {systemPages.map((sp) => (
                    <tr key={sp.slug}>
                      <td>
                        <div className="fw-bold text-dark">{sp.title}</div>
                        <div className="text-muted fs-12">{sp.desc}</div>
                      </td>
                      <td>
                        <Link href={sp.path} target="_blank" className="badge bg-light text-primary border fs-12 text-decoration-none">
                          {sp.path} ↗
                        </Link>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary px-2 py-1 fs-12">Visual Blocks Engine</span>
                      </td>
                      <td>
                        <span className="badge bg-info-subtle text-info px-2 py-1 fs-12">System Page</span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            href={sp.path}
                            target="_blank"
                            className="btn btn-soft-info btn-sm"
                            title="Preview Live Page"
                          >
                            <iconify-icon icon="solar:eye-broken" className="fs-18 align-middle"></iconify-icon>
                          </Link>
                          <Link
                            href={`/admin/cms/builder?page=${sp.slug}`}
                            className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5 fw-semibold"
                            title="Open in Visual Builder"
                          >
                            <iconify-icon icon="solar:pallete-2-bold" className="fs-16 align-middle"></iconify-icon>
                            <span>Design Page</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Custom Static Pages Card ── */}
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
            <div>
              <h4 className="card-title mb-1 text-dark fw-bold">Custom Static Pages</h4>
              <p className="text-muted fs-13 mb-0">Create and manage additional standalone pages (Terms, Privacy, FAQs, Bespoke landings).</p>
            </div>
            <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={openCreate}>
              <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Create New Page
            </button>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center p-4">Loading pages...</div>
            ) : pages.length === 0 ? (
              <div className="text-center p-4 text-muted">No custom pages created yet. Click "Create New Page" to start!</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Page Title</th>
                      <th>URL Slug</th>
                      <th>Status</th>
                      <th>Last Modified</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id}>
                        <td><a href="#!" onClick={() => openEdit(page)} className="fw-semibold text-dark">{page.title}</a></td>
                        <td>
                          <Link href={`/${page.slug}`} target="_blank" className="text-primary fs-13">/{page.slug}</Link>
                        </td>
                        <td>
                          <span className={`badge px-2 py-1 fs-12 ${page.status === 'Published' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                            {page.status}
                          </span>
                        </td>
                        <td className="text-muted fs-13">{new Date(page.lastModified).toLocaleDateString()}</td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Link
                              href={`/admin/cms/builder?page=${page.slug}`}
                              className="btn btn-soft-warning btn-sm d-inline-flex align-items-center gap-1"
                              title="Design with Visual Builder"
                            >
                              <iconify-icon icon="solar:pallete-2-bold" className="fs-16 align-middle"></iconify-icon>
                              <span>Visual Builder</span>
                            </Link>
                            <a href={`/${page.slug}`} target="_blank" className="btn btn-soft-info btn-sm" title="Preview"><iconify-icon icon="solar:eye-broken" className="fs-18 align-middle"></iconify-icon></a>
                            <button className="btn btn-soft-primary btn-sm" onClick={() => openEdit(page)} title="Edit Text/SEO"><iconify-icon icon="solar:pen-2-broken" className="fs-18 align-middle"></iconify-icon></button>
                            <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(page.id)} title="Delete"><iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18 align-middle"></iconify-icon></button>
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
