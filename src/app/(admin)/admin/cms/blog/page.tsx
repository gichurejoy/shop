'use client';

import React, { useState, useEffect } from 'react';
import { getCmsPosts, saveCmsPost, deleteCmsPost } from '../../../../actions';
import type { CmsPost } from '../../../../../lib/cms';
import { TipTapEditor } from '../../../../../components/cms/TipTapEditor';

export default function BlogManagement() {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [editId, setEditId] = useState<string | undefined>();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Scheduled'>('Draft');
  const [author, setAuthor] = useState('Admin');
  const [categories, setCategories] = useState<string[]>(['Blog']);
  const [tags, setTags] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await getCmsPosts();
    setPosts(data);
    setLoading(false);
  };

  const openCreate = () => {
    setEditId(undefined);
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setStatus('Draft');
    setAuthor('Admin');
    setCategories(['Blog']);
    setTags([]);
    setFeaturedImage('');
    setSeoTitle('');
    setSeoDescription('');
    setView('edit');
  };

  const openEdit = (post: CmsPost) => {
    setEditId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setExcerpt(post.excerpt || '');
    setStatus(post.status);
    setAuthor(post.author || 'Admin');
    setCategories(post.categories || []);
    setTags(post.tags || []);
    setFeaturedImage(post.featuredImage || '');
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setView('edit');
  };

  const handleSave = async (publishStatus?: 'Published' | 'Draft') => {
    if (!title || !slug) return alert('Title and Slug are required.');
    setSaving(true);
    const finalStatus = publishStatus || status;
    await saveCmsPost({
      id: editId,
      title,
      slug,
      content,
      excerpt,
      status: finalStatus,
      author,
      categories,
      tags,
      featuredImage,
      seoTitle,
      seoDescription,
    });
    setSaving(false);
    setView('list');
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this post?')) {
      await deleteCmsPost(id);
      fetchPosts();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) setFeaturedImage(data.url);
    } catch (err) {
      alert('Upload failed');
    }
  };

  if (view === 'edit') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1050, background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{ height: '60px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px' }}>
          <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            <iconify-icon icon="solar:arrow-left-linear" style={{ fontSize: '20px' }}></iconify-icon> Posts
          </button>
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
          <input
            type="text"
            placeholder="Post Title..."
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
                  <span style={{ color: '#94a3b8' }}>/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="my-awesome-post"
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
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#475569', marginBottom: '4px', display: 'block' }}>Author</label>
                    <input type="text" value={author} onChange={e => setAuthor(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  </div>
                </div>
              </div>

              <hr style={{ borderColor: '#e2e8f0', margin: '0 -24px 24px -24px' }} />

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#0f172a' }}>Featured Image</h3>
                {featuredImage ? (
                  <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={featuredImage} alt="Featured" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    <button onClick={() => setFeaturedImage('')} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Remove</button>
                  </div>
                ) : (
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', border: '2px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', background: '#f8fafc' }}>
                    <iconify-icon icon="solar:gallery-add-bold" style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '8px' }}></iconify-icon>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Click to upload image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                )}
              </div>

              <hr style={{ borderColor: '#e2e8f0', margin: '0 -24px 24px -24px' }} />

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#0f172a' }}>Excerpt</h3>
                <textarea
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Short summary of the article..."
                  style={{ width: '100%', height: '80px', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', resize: 'vertical' }}
                />
              </div>

              <hr style={{ borderColor: '#e2e8f0', margin: '0 -24px 24px -24px' }} />

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#0f172a' }}>SEO Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#475569', marginBottom: '4px', display: 'block' }}>Meta Title</label>
                    <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="Default: Article Title" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#475569', marginBottom: '4px', display: 'block' }}>Meta Description</label>
                    <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)} placeholder="Default: Excerpt" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', height: '80px' }} />
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
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h4 className="card-title mb-0">Blog Articles</h4>
            <div className="d-flex gap-2">
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreate}>
                <iconify-icon icon="solar:pen-new-round-bold-duotone"></iconify-icon> Write Article
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="p-5 text-center text-muted">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="p-5 text-center text-muted">No blog posts found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Article</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Last Modified</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {post.featuredImage ? (
                              <img src={post.featuredImage} alt="" className="rounded" style={{ width: '60px', height: '40px', objectFit: 'cover' }} />
                            ) : (
                              <div className="rounded bg-light d-flex align-items-center justify-content-center" style={{ width: '60px', height: '40px' }}>
                                <iconify-icon icon="solar:image-broken" className="text-muted"></iconify-icon>
                              </div>
                            )}
                            <div>
                              <a href="#!" onClick={() => openEdit(post)} className="text-dark fw-medium fs-14">{post.title}</a>
                              <div className="text-muted fs-12">/{post.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="text-muted">{post.author}</span></td>
                        <td>
                          <span className={`badge px-2 py-1 fs-12 ${post.status === 'Published' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                            {post.status}
                          </span>
                        </td>
                        <td>{new Date(post.lastModified).toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-soft-primary btn-sm" onClick={() => openEdit(post)}><iconify-icon icon="solar:pen-2-broken" className="fs-18 align-middle"></iconify-icon></button>
                            <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(post.id)}><iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18 align-middle"></iconify-icon></button>
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
