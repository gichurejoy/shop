'use client';

import { useState } from 'react';
import Link from 'next/link';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', color: '#0f172a',
};

export default function AttributesFormPage({ isEdit = false }: { isEdit?: boolean }) {
  const [terms, setTerms] = useState(isEdit ? ['Red', 'Blue', 'Green', 'Black'] : ['']);
  const [name, setName] = useState(isEdit ? 'Color' : '');
  const [type, setType] = useState('Select');

  const addTerm = () => setTerms([...terms, '']);
  const removeTerm = (i: number) => setTerms(terms.filter((_, idx) => idx !== i));
  const updateTerm = (i: number, val: string) => {
    const updated = [...terms];
    updated[i] = val;
    setTerms(updated);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
          <Link href="/admin/attributes" style={{ color: '#64748b', textDecoration: 'none' }}>Attributes</Link> › <span style={{ color: '#ff6c2f' }}>{isEdit ? 'Edit' : 'Add New'}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{isEdit ? 'Edit Attribute' : 'Add Attribute'}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
            {isEdit ? 'Edit Attribute' : 'New Attribute'}
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Attribute Name *</label>
              <input type="text" placeholder="e.g. Color, Size, Material" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Slug</label>
              <input type="text" placeholder="auto-generated" value={name.toLowerCase().replace(/\s+/g, '-')} readOnly style={{ ...inputStyle, background: '#f8fafc', color: '#94a3b8' }} />
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Auto-generated from name. Used in URLs.</p>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option>Select</option>
                <option>Color Swatch</option>
                <option>Text</option>
                <option>Image</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '10px' }}>Terms / Values</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {terms.map((term, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="text" value={term} onChange={e => updateTerm(i, e.target.value)} placeholder={`Term ${i + 1}`} style={{ ...inputStyle, flex: 1 }} />
                    <button onClick={() => removeTerm(i)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                ))}
              </div>
              <button onClick={addTerm} style={{ marginTop: '10px', padding: '7px 14px', border: '1px dashed #e2e8f0', borderRadius: '8px', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>
                + Add Term
              </button>
            </div>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button style={{ flex: 1, padding: '11px', borderRadius: '8px', background: '#ff6c2f', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                {isEdit ? 'Update Attribute' : 'Save Attribute'}
              </button>
              <Link href="/admin/attributes" style={{ padding: '11px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                Cancel
              </Link>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Tips</div>
          <div style={{ padding: '20px', fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
            <p style={{ marginTop: 0 }}>Attributes are used to define features of products. Customers can filter products by these attributes on the shop page.</p>
            <p><strong style={{ color: '#0f172a' }}>Name:</strong> The visible name shown to customers (e.g. "Color").</p>
            <p><strong style={{ color: '#0f172a' }}>Terms:</strong> Possible values for this attribute (e.g. "Red", "Blue").</p>
            <p style={{ marginBottom: 0 }}><strong style={{ color: '#0f172a' }}>Type:</strong> How the terms are displayed on the product page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
