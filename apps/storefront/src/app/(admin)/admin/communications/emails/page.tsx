'use client';

import React, { useState } from 'react';

const FLOWS = [
  { id: 'f1', name: 'Welcome Email', trigger: 'User signs up', status: true, performance: '45% Open Rate' },
  { id: 'f2', name: 'Abandoned Cart', trigger: 'Cart left for 2 hours', status: true, performance: '12% Recovery Rate' },
  { id: 'f3', name: 'Post-purchase Follow up', trigger: '3 days after delivery', status: false, performance: '-' },
  { id: 'f4', name: 'Win-back (Inactive)', trigger: 'No purchase for 60 days', status: true, performance: '5% Win-back Rate' },
  { id: 'f5', name: 'Birthday Discount', trigger: 'On user birthday', status: false, performance: '-' },
];

const TEMPLATES = [
  { id: 't1', name: 'Order Confirmation', type: 'Transactional', lastUpdated: '2 days ago' },
  { id: 't2', name: 'Order Shipped', type: 'Transactional', lastUpdated: '1 week ago' },
  { id: 't3', name: 'Refund Processed', type: 'Transactional', lastUpdated: '1 month ago' },
  { id: 't4', name: 'Password Reset', type: 'System', lastUpdated: '3 months ago' },
];

export default function EmailsPage() {
  const [activeTab, setActiveTab] = useState<'flows' | 'templates'>('flows');
  const [flows, setFlows] = useState(FLOWS);
  
  // Editor State
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [editorContent, setEditorContent] = useState('');

  const toggleFlow = (id: string) => {
    setFlows(flows.map(f => f.id === id ? { ...f, status: !f.status } : f));
  };

  const openEditor = (template: any) => {
    setEditingTemplate(template);
    setEditorContent(`<h1>Hi {{customer.first_name}},</h1>\n<p>This is your ${template.name.toLowerCase()} email template.</p>\n<p>You can use variables like {{order.number}} and {{order.total}}.</p>`);
  };

  if (editingTemplate) {
    return (
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-sm btn-light" onClick={() => setEditingTemplate(null)}>
              <iconify-icon icon="solar:arrow-left-linear" className="fs-18 align-middle"></iconify-icon> Back
            </button>
            <h4 className="card-title mb-0">Editing Template: {editingTemplate.name}</h4>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2">
              <iconify-icon icon="solar:test-tube-bold-duotone"></iconify-icon> Send Test Email
            </button>
            <button className="btn btn-sm btn-primary d-flex align-items-center gap-2" onClick={() => setEditingTemplate(null)}>
              <iconify-icon icon="solar:disk-bold-duotone"></iconify-icon> Save Template
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="mb-3">
                <label className="form-label">Email Subject</label>
                <input type="text" className="form-control" defaultValue={`Your ${editingTemplate.name} - {{store.name}}`} />
              </div>
              <div className="mb-3">
                <label className="form-label">HTML Content</label>
                <textarea 
                  className="form-control font-monospace" 
                  rows={15} 
                  value={editorContent}
                  onChange={e => setEditorContent(e.target.value)}
                  style={{ backgroundColor: '#f8fafc', fontSize: '13px' }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-light p-3 rounded h-100 border">
                <h5 className="fs-15 mb-3">Live Preview</h5>
                <div className="bg-white p-4 border rounded" style={{ minHeight: '300px' }} dangerouslySetInnerHTML={{ __html: editorContent.replace('{{customer.first_name}}', 'John') }} />
                
                <h5 className="fs-15 mt-4 mb-2">Available Variables</h5>
                <ul className="list-unstyled text-muted fs-13 mb-0 d-flex flex-column gap-2">
                  <li><code>{'{{customer.first_name}}'}</code> - First Name</li>
                  <li><code>{'{{customer.last_name}}'}</code> - Last Name</li>
                  <li><code>{'{{order.number}}'}</code> - Order #</li>
                  <li><code>{'{{order.total}}'}</code> - Total Amount</li>
                  <li><code>{'{{store.name}}'}</code> - Store Name</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header border-bottom-0 pb-0">
            <ul className="nav nav-tabs border-bottom-0">
              <li className="nav-item">
                <button className={`nav-link fw-medium ${activeTab === 'flows' ? 'active border-bottom-0 bg-light-subtle text-primary' : 'text-muted'}`} onClick={() => setActiveTab('flows')}>
                  <iconify-icon icon="solar:routing-2-bold-duotone" className="me-2 align-middle"></iconify-icon>
                  Automated Flows
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link fw-medium ${activeTab === 'templates' ? 'active border-bottom-0 bg-light-subtle text-primary' : 'text-muted'}`} onClick={() => setActiveTab('templates')}>
                  <iconify-icon icon="solar:document-bold-duotone" className="me-2 align-middle"></iconify-icon>
                  Email Templates
                </button>
              </li>
            </ul>
          </div>
          
          <div className="card-body bg-light-subtle border-top pt-3 rounded-bottom">
            {activeTab === 'flows' ? (
              <div className="table-responsive">
                <table className="table bg-white rounded shadow-sm align-middle table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Flow Name</th>
                      <th>Trigger Event</th>
                      <th>Performance</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flows.map(f => (
                      <tr key={f.id}>
                        <td className="fw-medium text-dark">
                          <div className="d-flex align-items-center gap-2">
                            <iconify-icon icon="solar:letter-bold-duotone" className="text-primary fs-20"></iconify-icon>
                            {f.name}
                          </div>
                        </td>
                        <td><span className="badge bg-secondary-subtle text-secondary">{f.trigger}</span></td>
                        <td className="text-muted fs-13">{f.performance}</td>
                        <td>
                          <div className="form-check form-switch mb-0">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              checked={f.status} 
                              onChange={() => toggleFlow(f.id)} 
                              style={{ width: '32px', height: '18px', cursor: 'pointer' }}
                            />
                            <label className="form-check-label ms-2 fs-13" style={{ color: f.status ? '#22c55e' : '#94a3b8' }}>
                              {f.status ? 'Active' : 'Paused'}
                            </label>
                          </div>
                        </td>
                        <td className="text-end">
                          <button className="btn btn-soft-primary btn-sm" onClick={() => openEditor(f)}>Edit Flow</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table bg-white rounded shadow-sm align-middle table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Template Name</th>
                      <th>Category</th>
                      <th>Last Updated</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEMPLATES.map(t => (
                      <tr key={t.id}>
                        <td className="fw-medium text-dark">{t.name}</td>
                        <td><span className="badge bg-info-subtle text-info">{t.type}</span></td>
                        <td className="text-muted fs-13">{t.lastUpdated}</td>
                        <td className="text-end">
                          <button className="btn btn-soft-primary btn-sm" onClick={() => openEditor(t)}>
                            <iconify-icon icon="solar:pen-2-broken" className="fs-16 align-middle me-1"></iconify-icon> Edit Design
                          </button>
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
