'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Record<string, { id: string; q: string; a: string }[]>>({});
  const [activeCategory, setActiveCategory] = useState('General');
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New FAQ form state
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [savingFaq, setSavingFaq] = useState(false);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.faqs.get();
      setFaqs(res.faqs || {});
      const categories = Object.keys(res.faqs || {});
      if (categories.length > 0 && !categories.includes(activeCategory)) {
        setActiveCategory(categories[0]);
      }
    } catch (err: any) {
      toast.error('Failed to load FAQs: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error('Question and answer are both required.');
      return;
    }

    setSavingFaq(true);
    try {
      const newFaq = {
        id: `faq-${Date.now()}`,
        q: newQuestion.trim(),
        a: newAnswer.trim(),
      };
      const res = await apiClient.faqs.save({ category: activeCategory, faq: newFaq });
      setFaqs(res.faqs);
      toast.success('FAQ entry added and saved to MySQL!');
      setNewQuestion('');
      setNewAnswer('');
      setIsAdding(false);
    } catch (err: any) {
      toast.error('Failed to add FAQ: ' + (err.message || 'Error'));
    } finally {
      setSavingFaq(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ entry?')) return;
    try {
      const res = await apiClient.faqs.delete(activeCategory, id);
      setFaqs(res.faqs);
      toast.success('FAQ entry removed.');
    } catch (err: any) {
      toast.error('Failed to delete FAQ: ' + (err.message || 'Error'));
    }
  };

  const categories = Object.keys(faqs);
  const currentCategoryFaqs = faqs[activeCategory] || [];

  const filteredFaqs = search
    ? Object.entries(faqs).flatMap(([cat, items]) =>
        items
          .filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
          .map((f) => ({ ...f, category: cat }))
      )
    : currentCategoryFaqs.map((f) => ({ ...f, category: activeCategory }));

  return (
    <div>
      {/* Hero Header */}
      <div className="card mb-4 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
        <div className="card-body py-5 text-center text-white">
          <h2 className="fw-bold mb-2 text-white">Atelier Help Center &amp; FAQs</h2>
          <p className="text-white-50 mb-4 fs-14">Search concierge answers or manage customer support documentation.</p>
          <div className="mx-auto position-relative" style={{ maxWidth: '520px' }}>
            <input
              type="search"
              className="form-control form-control-lg bg-white border-0 shadow-sm"
              placeholder="Search knowledge base..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '44px' }}
            />
            <iconify-icon
              icon="solar:magnifer-linear"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '20px' }}
            ></iconify-icon>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Category Pills & Action */}
        <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
          {!search && (
            <div className="d-flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat} ({faqs[cat]?.length || 0})
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            className="btn btn-sm btn-primary d-flex align-items-center gap-1 ms-auto"
            onClick={() => setIsAdding(!isAdding)}
          >
            <iconify-icon icon="solar:add-circle-bold"></iconify-icon> {isAdding ? 'Cancel' : 'Add FAQ Article'}
          </button>
        </div>

        {/* Add FAQ Box */}
        {isAdding && (
          <div className="col-12">
            <div className="card shadow-sm border-0 border-start border-primary border-4">
              <div className="card-header border-bottom bg-transparent py-3">
                <h5 className="card-title mb-0 fw-bold">Add FAQ to Category: {activeCategory}</h5>
              </div>
              <form onSubmit={handleAddFaq}>
                <div className="card-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Question Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Can items be resized or customized?"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Concierge Answer *</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Detailed answer for customers..."
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer border-top bg-transparent p-3 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={() => setIsAdding(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={savingFaq}>
                    {savingFaq ? 'Saving...' : 'Save to Knowledge Base'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQs Accordion */}
        <div className="col-12">
          {loading ? (
            <div className="text-center py-5 text-muted">
              <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
              Loading FAQ articles...
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="card shadow-sm border-0 p-5 text-center text-muted">
              <iconify-icon icon="solar:question-circle-broken" className="fs-36 mb-2"></iconify-icon>
              <p className="mb-0">No FAQ articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="accordion" id="faqAccordion">
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div key={faq.id} className="card shadow-sm border-0 mb-3 overflow-hidden">
                    <div
                      className="card-header bg-white py-3 d-flex justify-content-between align-items-center"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <iconify-icon
                          icon="solar:question-circle-bold"
                          className="text-primary fs-20 flex-shrink-0"
                        ></iconify-icon>
                        <h6 className="mb-0 fw-semibold text-dark">{faq.q}</h6>
                        {search && (
                          <span className="badge bg-light text-muted border fs-11 ms-2">{faq.category}</span>
                        )}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0 me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFaq(faq.id);
                          }}
                          title="Delete FAQ"
                        >
                          <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="fs-16"></iconify-icon>
                        </button>
                        <iconify-icon
                          icon={isOpen ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                          className="text-muted fs-18"
                        ></iconify-icon>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="card-body pt-0 px-4 pb-4">
                        <div className="p-3 bg-light rounded text-dark fs-14" style={{ lineHeight: '1.6' }}>
                          {faq.a}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
