'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function EmailsPage() {
  const [activeTab, setActiveTab] = useState<'flows' | 'templates'>('flows');
  const [flows, setFlows] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTestInput, setShowTestInput] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState('concierge@waveron.com');
  
  // Editor State
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [templateSubject, setTemplateSubject] = useState('');
  const [editorContent, setEditorContent] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.communications.get();
      setFlows(res.flows || []);
      setTemplates(res.templates || []);
    } catch (err: any) {
      toast.error('Failed to load email communications: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleFlow = async (id: string) => {
    const nextFlows = flows.map((f) => (f.id === id ? { ...f, status: !f.status } : f));
    setFlows(nextFlows);
    try {
      await apiClient.communications.save({ flows: nextFlows });
      const target = nextFlows.find((f) => f.id === id);
      toast.success(`Automated flow "${target?.name}" is now ${target?.status ? 'ENABLED' : 'DISABLED'}`);
    } catch (err: any) {
      toast.error('Failed to update flow: ' + (err.message || 'Error'));
    }
  };

  const openEditor = (template: any) => {
    setEditingTemplate(template);
    setTemplateSubject(template.subject || `${template.name} Notification`);
    setEditorContent(template.content || `<h1>Hi {{customer.first_name}},</h1>\n<p>This is your ${template.name.toLowerCase()} notification.</p>`);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    setSaving(true);
    try {
      const updatedTemplate = {
        ...editingTemplate,
        subject: templateSubject,
        content: editorContent,
      };
      await apiClient.communications.save({ template: updatedTemplate });
      toast.success(`Template "${editingTemplate.name}" saved to MySQL!`);
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingTemplate.id ? { ...t, ...updatedTemplate, lastUpdated: 'Just now' } : t))
      );
      setEditingTemplate(null);
    } catch (err: any) {
      toast.error('Failed to save template: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = () => {
    if (!testEmailInput.trim()) {
      toast.error('Recipient email address is required');
      return;
    }
    toast.success(`Test email dispatched to ${testEmailInput.trim()}!`);
    setShowTestInput(false);
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading email communications...</p>
      </div>
    );
  }

  if (editingTemplate) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-header border-bottom bg-transparent d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center gap-3">
            <button type="button" className="btn btn-sm btn-light" onClick={() => setEditingTemplate(null)}>
              <iconify-icon icon="solar:arrow-left-broken" className="fs-18 align-middle"></iconify-icon> Back
            </button>
            <h5 className="card-title mb-0 fw-bold">Editing Template: {editingTemplate.name}</h5>
          </div>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            {showTestInput ? (
              <div className="d-flex align-items-center gap-1">
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Recipient email"
                  value={testEmailInput}
                  onChange={(e) => setTestEmailInput(e.target.value)}
                  style={{ width: '220px' }}
                />
                <button type="button" className="btn btn-sm btn-success" onClick={handleSendTest}>
                  Send
                </button>
                <button type="button" className="btn btn-sm btn-light" onClick={() => setShowTestInput(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={() => setShowTestInput(true)}>
                <iconify-icon icon="solar:letter-opened-bold"></iconify-icon> Send Test Dispatch
              </button>
            )}
            <button
              type="button"
              className="btn btn-sm btn-primary d-flex align-items-center gap-2 px-3"
              onClick={handleSaveTemplate}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Saving...
                </>
              ) : (
                <>
                  <iconify-icon icon="solar:diskette-bold" className="fs-16"></iconify-icon> Save Template
                </>
              )}
            </button>
          </div>
        </div>
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-md-8">
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Subject Line</label>
                <input
                  type="text"
                  className="form-control"
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Body HTML Content</label>
                <textarea
                  className="form-control font-monospace"
                  rows={12}
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-light rounded border">
                <h6 className="fw-bold mb-2">Available Variables</h6>
                <p className="text-muted fs-12 mb-3">Copy and paste these tags into your subject or body template:</p>
                <div className="d-flex flex-column gap-2 font-monospace fs-12">
                  <code>{"{{customer.first_name}}"}</code>
                  <code>{"{{order.number}}"}</code>
                  <code>{"{{order.total}}"}</code>
                  <code>{"{{order.tracking_number}}"}</code>
                  <code>{"{{refund.amount}}"}</code>
                  <code>{"{{reset_url}}"}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="card shadow-sm border-0">
          <div className="card-header border-bottom-0 pb-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <ul className="nav nav-tabs border-bottom-0">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link fw-semibold ${activeTab === 'flows' ? 'active text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab('flows')}
                >
                  Automated Flows ({flows.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link fw-semibold ${activeTab === 'templates' ? 'active text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab('templates')}
                >
                  Transactional Templates ({templates.length})
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-0">
            {activeTab === 'flows' ? (
              <div className="table-responsive">
                <table className="table align-middle table-hover mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Automated Flow Name</th>
                      <th>Trigger Event</th>
                      <th>Benchmark Conversion</th>
                      <th>Status Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flows.map((f) => (
                      <tr key={f.id}>
                        <td>
                          <div className="fw-semibold text-dark">{f.name}</div>
                        </td>
                        <td className="text-muted fs-13">{f.trigger}</td>
                        <td>
                          <span className="badge bg-light text-dark border">{f.performance}</span>
                        </td>
                        <td>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={f.status}
                              onChange={() => toggleFlow(f.id)}
                              style={{ cursor: 'pointer' }}
                            />
                            <label className="form-check-label fs-12 text-muted ms-1">
                              {f.status ? 'Active' : 'Disabled'}
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle table-hover mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Template Name</th>
                      <th>Message Type</th>
                      <th>Subject Line</th>
                      <th>Last Updated</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <span className="fw-semibold text-dark">{t.name}</span>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary">{t.type}</span>
                        </td>
                        <td className="text-muted fs-13 text-truncate" style={{ maxWidth: '240px' }}>
                          {t.subject || 'Default Subject'}
                        </td>
                        <td className="text-muted fs-13">{t.lastUpdated}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary d-flex align-items-center gap-1 ms-auto"
                            onClick={() => openEditor(t)}
                          >
                            <iconify-icon icon="solar:pen-2-broken"></iconify-icon> Edit Template
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card-footer border-top bg-transparent py-3">
            <span className="text-muted fs-12">Communications registry synchronized with MySQL database settings.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
