'use client';

import React, { useState } from 'react';

type TaxRegion = {
  id: string;
  region: string;
  country: string;
  rate: string;
  digitalRate: string;
  status: boolean;
};

const INITIAL_TAXES: TaxRegion[] = [
  { id: '1', region: 'California', country: 'United States', rate: '7.25%', digitalRate: '0.00%', status: true },
  { id: '2', region: 'New York', country: 'United States', rate: '4.00%', digitalRate: '4.00%', status: true },
  { id: '3', region: 'Texas', country: 'United States', rate: '6.25%', digitalRate: '6.25%', status: true },
  { id: '4', region: 'Ontario', country: 'Canada', rate: '13.00%', digitalRate: '13.00%', status: false },
  { id: '5', region: 'Nairobi', country: 'Kenya', rate: '16.00%', digitalRate: '16.00%', status: true },
];

export default function TaxesPage() {
  const [taxes, setTaxes] = useState(INITIAL_TAXES);
  const [taxCalculation, setTaxCalculation] = useState('inclusive');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    country: '',
    region: '',
    rate: '',
    digitalRate: ''
  });

  const handleSave = () => {
    setTaxes([
      ...taxes,
      {
        id: Math.random().toString(),
        country: formData.country,
        region: formData.region,
        rate: `${formData.rate}%`,
        digitalRate: `${formData.digitalRate || formData.rate}%`,
        status: true
      }
    ]);
    setIsModalOpen(false);
    setFormData({ country: '', region: '', rate: '', digitalRate: '' });
  };

  return (
    <div className="row">
      <div className="col-12">
        
        {/* Global Settings */}
        <div className="card mb-4">
          <div className="card-header border-bottom">
            <h4 className="card-title mb-0">Global Tax Settings</h4>
          </div>
          <div className="card-body">
            <div className="row g-4 align-items-center">
              <div className="col-md-6">
                <h5 className="fs-15 fw-bold mb-1">Tax Calculation</h5>
                <p className="text-muted fs-13 mb-0">How should taxes be calculated on product prices?</p>
              </div>
              <div className="col-md-6">
                <div className="d-flex gap-3">
                  <div className={`border rounded p-3 cursor-pointer flex-1 ${taxCalculation === 'inclusive' ? 'border-primary bg-primary-subtle' : 'bg-light'}`} onClick={() => setTaxCalculation('inclusive')}>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" checked={taxCalculation === 'inclusive'} readOnly />
                      <label className="form-check-label fw-medium text-dark">Prices Include Tax</label>
                    </div>
                    <div className="text-muted fs-12 ms-4 mt-1">Tax is already included in the catalog price.</div>
                  </div>
                  <div className={`border rounded p-3 cursor-pointer flex-1 ${taxCalculation === 'exclusive' ? 'border-primary bg-primary-subtle' : 'bg-light'}`} onClick={() => setTaxCalculation('exclusive')}>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" checked={taxCalculation === 'exclusive'} readOnly />
                      <label className="form-check-label fw-medium text-dark">Prices Exclude Tax</label>
                    </div>
                    <div className="text-muted fs-12 ms-4 mt-1">Tax is added to the subtotal at checkout.</div>
                  </div>
                </div>
              </div>
            </div>
            
            <hr className="my-4" />

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fs-15 fw-bold mb-1">Charge tax on shipping rates</h5>
                <p className="text-muted fs-13 mb-0">Apply tax rules to the cost of shipping.</p>
              </div>
              <div className="form-check form-switch mb-0">
                <input className="form-check-input" type="checkbox" defaultChecked style={{ width: '40px', height: '24px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Regional Taxes */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h4 className="card-title mb-0">Regional Tax Rates</h4>
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={() => setIsModalOpen(true)}>
              <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Region
            </button>
          </div>
          
          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Country</th>
                    <th>State / Region</th>
                    <th>Standard Rate</th>
                    <th>Digital Goods Rate</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taxes.map(tax => (
                    <tr key={tax.id}>
                      <td className="fw-medium text-dark">{tax.country}</td>
                      <td>{tax.region}</td>
                      <td className="fw-bold">{tax.rate}</td>
                      <td>{tax.digitalRate}</td>
                      <td>
                        <div className="form-check form-switch mb-0 d-inline-block">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            checked={tax.status} 
                            onChange={() => setTaxes(taxes.map(t => t.id === tax.id ? { ...t, status: !t.status } : t))}
                          />
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn btn-soft-primary btn-sm"><iconify-icon icon="solar:pen-2-broken" className="fs-16 align-middle"></iconify-icon></button>
                          <button className="btn btn-soft-danger btn-sm" onClick={() => setTaxes(taxes.filter(t => t.id !== tax.id))}><iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-16 align-middle"></iconify-icon></button>
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

      {/* Add Region Modal */}
      {isModalOpen && (
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow-lg m-3" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="card-header border-bottom d-flex justify-content-between align-items-center bg-light-subtle">
              <h5 className="card-title mb-0">Add Tax Region</h5>
              <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
            </div>
            <div className="card-body">
              
              <div className="mb-3">
                <label className="form-label fw-medium text-dark">Country</label>
                <input type="text" className="form-control" placeholder="e.g. United Kingdom" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-medium text-dark">Region / State</label>
                <input type="text" className="form-control" placeholder="e.g. England or *" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} />
                <div className="form-text mt-1 text-muted">Use * to apply to the entire country.</div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label fw-medium text-dark">Standard Rate</label>
                  <div className="input-group">
                    <input type="number" className="form-control" placeholder="20" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label fw-medium text-dark">Digital Rate</label>
                  <div className="input-group">
                    <input type="number" className="form-control" placeholder="20" value={formData.digitalRate} onChange={e => setFormData({...formData, digitalRate: e.target.value})} />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="button" className="btn btn-light" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!formData.country || !formData.rate}>Save Region</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
