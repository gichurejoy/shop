'use client';

import Link from 'next/link';

const ATTRIBUTES = [
  { id: 1, name: 'Color', slug: 'color', terms: ['Red', 'Blue', 'Green', 'Black', 'White'], type: 'Select' },
  { id: 2, name: 'Size', slug: 'size', terms: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], type: 'Select' },
  { id: 3, name: 'Material', slug: 'material', terms: ['Cotton', 'Polyester', 'Wool', 'Silk'], type: 'Select' },
  { id: 4, name: 'Brand', slug: 'brand', terms: ['Nike', 'Adidas', 'Puma', 'Reebok'], type: 'Select' },
];

export default function AttributesListPage() {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title">Attributes</h4>
        <Link href="/admin/attributes/new" className="btn btn-sm btn-primary d-flex align-items-center gap-1">
          <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Attribute
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table align-middle mb-0 table-hover table-centered">
          <thead className="bg-light-subtle">
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Type</th>
              <th>Terms</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ATTRIBUTES.map(a => (
              <tr key={a.id}>
                <td className="fw-medium">{a.name}</td>
                <td><code>{a.slug}</code></td>
                <td>{a.type}</td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    {a.terms.map(t => (
                      <span key={t} className="badge bg-light text-dark border">{t}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <a className="btn btn-light btn-sm" href="#!"><iconify-icon className="align-middle fs-18" icon="solar:eye-broken"></iconify-icon></a>
                    <Link href="/admin/attributes/edit" className="btn btn-soft-primary btn-sm"><iconify-icon className="align-middle fs-18" icon="solar:pen-2-broken"></iconify-icon></Link>
                    <a className="btn btn-soft-danger btn-sm" href="#!"><iconify-icon className="align-middle fs-18" icon="solar:trash-bin-minimalistic-2-broken"></iconify-icon></a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-footer border-top">
        <nav>
          <ul className="pagination justify-content-end mb-0">
            <li className="page-item"><a className="page-link" href="#!">Previous</a></li>
            <li className="page-item active"><a className="page-link" href="#!">1</a></li>
            <li className="page-item"><a className="page-link" href="#!">2</a></li>
            <li className="page-item"><a className="page-link" href="#!">Next</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
