'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

function AttributeFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get('id');
  const initialName = searchParams.get('name') || '';
  const initialType = searchParams.get('type') || 'Select';
  const initialTermsRaw = searchParams.get('terms');

  const [name, setName] = useState(initialName);
  const [type, setType] = useState(initialType);
  const [terms, setTerms] = useState<string[]>(
    initialTermsRaw ? initialTermsRaw.split(',').filter(Boolean) : ['']
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTerm = () => setTerms([...terms, '']);
  const removeTerm = (i: number) => setTerms(terms.filter((_, idx) => idx !== i));
  const updateTerm = (i: number, val: string) => {
    const updated = [...terms];
    updated[i] = val;
    setTerms(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an attribute name.');
      return;
    }
    const cleanTerms = terms.map(t => t.trim()).filter(Boolean);
    if (cleanTerms.length === 0) {
      setError('Please provide at least one value/term for this attribute.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await apiClient.attributes.save({
        id: editId || undefined,
        name: name.trim(),
        type,
        terms: cleanTerms,
      });
      router.push('/admin/attributes');
    } catch (err: any) {
      setError(err?.message || 'Failed to save attribute');
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <div className="text-muted fs-13 mb-1">
          <Link href="/admin/attributes" className="text-muted text-decoration-none">Attributes</Link> › <span className="text-primary">{editId ? 'Edit Attribute' : 'Add New Attribute'}</span>
        </div>
        <h3 className="fw-bold text-dark mb-0">{editId ? 'Edit Attribute' : 'Create New Attribute'}</h3>
      </div>

      {error && (
        <div className="alert alert-danger py-2 mb-3 fs-14">
          <iconify-icon icon="solar:danger-triangle-bold" className="align-middle me-1"></iconify-icon>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header border-bottom">
                <h5 className="card-title mb-0">Attribute Configuration</h5>
              </div>
              <div className="card-body d-flex flex-column gap-3">
                <div>
                  <label className="form-label fw-semibold">Attribute Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ring Size, Metal Purity, Gemstone Grade"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold">Slug Identifier</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    placeholder="auto-generated-slug"
                    value={name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    readOnly
                  />
                  <small className="text-muted">Unique machine key used for variant matching.</small>
                </div>

                <div>
                  <label className="form-label fw-semibold">Control Display Type</label>
                  <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Select">Dropdown Select</option>
                    <option value="Color Swatch">Color Swatch</option>
                    <option value="Radio Button Pill">Radio Button Pill</option>
                    <option value="Text">Text Pill</option>
                  </select>
                </div>

                <div>
                  <label className="form-label fw-semibold d-flex justify-content-between align-items-center">
                    <span>Terms / Options Values <span className="text-danger">*</span></span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={addTerm}
                    >
                      <iconify-icon icon="solar:add-circle-bold" className="align-middle me-1"></iconify-icon> Add Term
                    </button>
                  </label>

                  <div className="d-flex flex-column gap-2 mt-2">
                    {terms.map((term, i) => (
                      <div key={i} className="d-flex gap-2 align-items-center">
                        <input
                          type="text"
                          className="form-control"
                          value={term}
                          onChange={(e) => updateTerm(i, e.target.value)}
                          placeholder={`Option ${i + 1} (e.g. 18k Yellow Gold, US 7, Obsidian)`}
                        />
                        {terms.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-soft-danger px-3"
                            onClick={() => removeTerm(i)}
                          >
                            <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18"></iconify-icon>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2 pt-3 border-top mt-2">
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : editId ? 'Update Attribute' : 'Save Attribute'}
                  </button>
                  <Link href="/admin/attributes" className="btn btn-outline-secondary px-4">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header border-bottom">
                <h5 className="card-title mb-0">Merchandising Guidance</h5>
              </div>
              <div className="card-body fs-13 text-muted" style={{ lineHeight: '1.8' }}>
                <p>
                  <strong>Attributes</strong> define selectable parameters for luxury goods on the storefront.
                </p>
                <ul className="ps-3 mb-3">
                  <li><strong>Color Swatch:</strong> Visual palette selector for metals & fabrics.</li>
                  <li><strong>Dropdown Select:</strong> Clean dropdown for large term lists like ring sizes.</li>
                  <li><strong>Radio Button Pill:</strong> High-visibility buttons for standard sizes (S, M, L).</li>
                </ul>
                <div className="p-3 bg-light rounded border">
                  <iconify-icon icon="solar:shield-check-bold" className="text-success align-middle me-1"></iconify-icon>
                  <strong>Live Persistence:</strong> Saved attributes are immediately available for product tagging and catalog filtering.
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AttributesFormPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading attribute editor...</div>}>
      <AttributeFormContent />
    </Suspense>
  );
}
