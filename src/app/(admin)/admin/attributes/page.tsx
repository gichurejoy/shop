'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface IAttribute {
  id: string;
  name: string;
  slug: string;
  type: string;
  terms: string[];
}

export default function AttributesListPage() {
  const [attributes, setAttributes] = useState<IAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAttributes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.attributes.list();
      setAttributes(res.attributes || []);
    } catch (err) {
      console.error('Failed to load attributes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttributes();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the attribute "${name}"?`)) return;
    setDeletingId(id);
    try {
      await apiClient.attributes.delete(id);
      setAttributes(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete attribute');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = attributes.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.slug.toLowerCase().includes(search.toLowerCase()) ||
    (a.terms && a.terms.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 className="card-title mb-1">Product Attributes & Variants</h4>
          <p className="text-muted fs-13 mb-0">Manage sizes, precious metals, gemstone grades, and luxury variations.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search attributes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: '220px' }}
            />
          </div>
          <Link href="/admin/attributes/new" className="btn btn-sm btn-primary d-flex align-items-center gap-1">
            <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Attribute
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle mb-0 table-hover table-centered">
          <thead className="bg-light-subtle">
            <tr>
              <th>Attribute Name</th>
              <th>Slug</th>
              <th>Display Type</th>
              <th>Terms / Values</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                  Loading attributes from MySQL...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  No attributes found. Click "Add Attribute" above to create one.
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id}>
                  <td className="fw-medium text-dark">{a.name}</td>
                  <td><code>{a.slug}</code></td>
                  <td>
                    <span className="badge bg-secondary-subtle text-secondary">{a.type || 'Select'}</span>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '420px' }}>
                      {a.terms && a.terms.map((t, idx) => (
                        <span key={idx} className="badge bg-light text-dark border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Link
                        href={`/admin/attributes/new?id=${a.id}&name=${encodeURIComponent(a.name)}&type=${encodeURIComponent(a.type || '')}&terms=${encodeURIComponent((a.terms || []).join(','))}`}
                        className="btn btn-soft-primary btn-sm"
                        title="Edit Attribute"
                      >
                        <iconify-icon className="align-middle fs-18" icon="solar:pen-2-broken"></iconify-icon>
                      </Link>
                      <button
                        className="btn btn-soft-danger btn-sm"
                        onClick={() => handleDelete(a.id, a.name)}
                        disabled={deletingId === a.id}
                        title="Delete Attribute"
                      >
                        <iconify-icon className="align-middle fs-18" icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card-footer border-top d-flex justify-content-between align-items-center">
        <span className="text-muted fs-13">Showing {filtered.length} attributes</span>
        <button onClick={loadAttributes} className="btn btn-sm btn-outline-light text-dark">
          <iconify-icon icon="solar:restart-bold" className="align-middle me-1"></iconify-icon> Refresh
        </button>
      </div>
    </div>
  );
}
