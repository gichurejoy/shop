'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useCms } from './cms-store';
import { SectionsPanel } from './SectionsPanel';
import { getIndustryTemplates, applyIndustryTemplate } from '@/app/actions';
import { toast } from 'sonner';

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

export function EditorShell({
  pageTitle,
  currentPageSlug = 'home',
  availablePages = [],
  onSwitchPage,
  onSaveDraft,
  onPublish,
}: {
  pageTitle: string;
  currentPageSlug?: string;
  availablePages?: Array<{ slug: string; title: string; isSystem?: boolean }>;
  onSwitchPage?: (slug: string) => Promise<void>;
  onSaveDraft: (sections: any[]) => Promise<void>;
  onPublish: () => Promise<void>;
}) {
  const {
    sections,
    isDirty,
    activeId,
    setActive,
    setActiveElement,
    setActiveTab,
    markSaved,
    updateSection,
    setSections,
    removeSection,
    duplicateSection,
    canUndo,
    canRedo,
    undo,
    redo,
    discardChanges,
  } = useCms();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [iframeReady, setIframeReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState<string | null>(null);
  const [templatesList, setTemplatesList] = useState<any[]>([]);
  const sendTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getIndustryTemplates().then(setTemplatesList).catch(() => {});
  }, []);

  const handleApplyTemplate = async (templateId: string) => {
    setApplyingTemplate(templateId);
    try {
      const newSections = await applyIndustryTemplate(currentPageSlug, templateId);
      setSections(newSections);
      iframeRef.current?.contentWindow?.postMessage({ type: 'INIT', sections: newSections }, '*');
      const found = templatesList.find(t => t.id === templateId);
      toast.success(`Applied ${found?.name || templateId} Starter Kit!`);
      setTemplatesModalOpen(false);
    } catch (err: any) {
      toast.error('Failed to apply template: ' + (err?.message || 'Unknown error'));
    } finally {
      setApplyingTemplate(null);
    }
  };

  // Send postMessage to iframe (debounced 300ms)
  const sendToPreview = useCallback((sections: any[], type = 'UPDATE') => {
    if (sendTimer.current) clearTimeout(sendTimer.current);
    sendTimer.current = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage({ type, sections }, '*');
    }, 300);
  }, []);

  // On state change, send to iframe
  useEffect(() => {
    if (iframeReady) sendToPreview(sections);
  }, [sections, iframeReady, sendToPreview]);

  // On active section change, highlight in iframe
  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_ACTIVE', id: activeId }, '*');
  }, [activeId]);

  // Listen for messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_READY') {
        setIframeReady(true);
        iframeRef.current?.contentWindow?.postMessage({ type: 'INIT', sections }, '*');
      }
      if (e.data?.type === 'SECTION_CLICKED') {
        setActive(e.data.id);
        setActiveTab('customize');
      }
      if (e.data?.type === 'ELEMENT_SELECTED') {
        setActiveElement(e.data.element);
      }
      if (e.data?.type === 'SECTION_UPDATED') {
        updateSection(e.data.id, e.data.patch);
      }
      if (e.data?.type === 'SECTIONS_REORDERED') {
        setSections(e.data.sections);
      }
      if (e.data?.type === 'SECTION_DELETED') {
        removeSection(e.data.id);
      }
      if (e.data?.type === 'SECTION_DUPLICATED') {
        duplicateSection(e.data.id);
      }
      if (e.data?.type === 'INSERT_BLOCK_CLICKED') {
        setInsertAtIndex(e.data.index);
        setActiveTab('blocks');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [sections, setActive, setActiveElement, setActiveTab, updateSection, setSections, removeSection, duplicateSection]);

  // Keyboard shortcuts (Ctrl+S, Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sections, canUndo, canRedo, undo, redo]);

  const handleSaveDraft = async () => {
    setSaving(true);
    await onSaveDraft(sections);
    markSaved();
    setSaving(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    await onSaveDraft(sections);
    await onPublish();
    markSaved();
    setPublishing(false);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        zIndex: 1050, background: '#f1f5f9', fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Top Bar ── */}
      <div
        style={{
          height: '52px', background: '#1e293b', display: 'flex',
          alignItems: 'center', padding: '0 16px', gap: '12px',
          flexShrink: 0, borderBottom: '1px solid #334155',
        }}
      >
        <a
          href="/admin"
          style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '13px' }}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/admin';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Admin
        </a>

        <div style={{ width: '1px', height: '24px', background: '#334155' }} />

        {/* Page Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Editing:</span>
          <select
            value={currentPageSlug}
            onChange={async (e) => {
              const newSlug = e.target.value;
              if (onSwitchPage) {
                await onSwitchPage(newSlug);
              }
            }}
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <optgroup label="Core Store Pages">
              <option value="home">🏠 Homepage (/)</option>
              <option value="about">📖 About Us (/about)</option>
              <option value="care-guide">💎 Care Guide (/care-guide)</option>
              <option value="lookbook">📸 Lookbook (/lookbook)</option>
              <option value="membership">👑 VIP Membership (/membership)</option>
            </optgroup>
            {availablePages.filter(p => !p.isSystem).length > 0 && (
              <optgroup label="Custom Static Pages">
                {availablePages.filter(p => !p.isSystem).map(p => (
                  <option key={p.slug} value={p.slug}>📄 {p.title} (/{p.slug})</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* Undo / Redo Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '4px' }}>
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            style={{
              padding: '5px 8px',
              borderRadius: '6px',
              border: 'none',
              background: '#0f172a',
              color: canUndo ? '#f1f5f9' : '#64748b',
              cursor: canUndo ? 'pointer' : 'not-allowed',
              opacity: canUndo ? 1 : 0.4,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Undo (Ctrl+Z)"
          >
            <span>↩</span>
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            style={{
              padding: '5px 8px',
              borderRadius: '6px',
              border: 'none',
              background: '#0f172a',
              color: canRedo ? '#f1f5f9' : '#64748b',
              cursor: canRedo ? 'pointer' : 'not-allowed',
              opacity: canRedo ? 1 : 0.4,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Redo (Ctrl+Y)"
          >
            <span>↪</span>
          </button>
        </div>

        {/* Industry Starter Kits Preset Modal Trigger */}
        <button
          type="button"
          onClick={() => setTemplatesModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            marginLeft: '6px',
            boxShadow: '0 2px 6px rgba(124, 58, 237, 0.35)',
          }}
          title="Apply pre-built industry presets (Hardware, Tech, Fashion, Grocery, Retail, Jewelry)"
        >
          <span>📦</span>
          <span>Industry Starter Kits</span>
        </button>

        {isDirty && (
          <span style={{ color: '#f59e0b', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            Unsaved changes
          </span>
        )}

        <div style={{ flex: 1 }} />

        {/* Viewport switcher */}
        <div style={{ display: 'flex', background: '#0f172a', borderRadius: '8px', padding: '3px', gap: '2px' }}>
          {(['desktop', 'tablet', 'mobile'] as Viewport[]).map(v => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              style={{
                padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                background: viewport === v ? '#ff6c2f' : 'transparent',
                color: viewport === v ? '#fff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              {v === 'desktop' ? '🖥' : v === 'tablet' ? '📱' : '📲'} {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => window.open(currentPageSlug === 'home' ? '/' : `/${currentPageSlug}`, '_blank')}
          style={{
            padding: '7px 16px', borderRadius: '8px', border: '1px solid #475569', background: 'transparent',
            color: '#cbd5e1', fontWeight: 500, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
          }}
          title="Open live storefront page in a new tab"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Preview Site
        </button>

        {isDirty && (
          <button
            type="button"
            onClick={discardChanges}
            style={{
              padding: '7px 14px', borderRadius: '8px', border: '1px solid #64748b', background: 'transparent',
              color: '#94a3b8', fontWeight: 500, fontSize: '13px', cursor: 'pointer',
            }}
            title="Discard unsaved changes and reload last draft"
          >
            Discard
          </button>
        )}

        <button
          onClick={handleSaveDraft}
          disabled={saving}
          style={{
            padding: '7px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#334155',
            color: '#f1f5f9', fontWeight: 500, fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          {saving ? 'Saving…' : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Draft</>}
        </button>

        <button
          onClick={handlePublish}
          disabled={publishing}
          style={{
            padding: '7px 20px', borderRadius: '8px', border: 'none', background: publishing ? '#6366f1' : '#ff6c2f',
            color: '#fff', fontWeight: 600, fontSize: '13px', cursor: publishing ? 'not-allowed' : 'pointer',
          }}
        >
          {publishing ? 'Publishing…' : '🚀 Publish Live'}
        </button>
      </div>

      {/* ── Main split view ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel */}
        <div
          style={{
            width: '380px', flexShrink: 0, background: '#fff',
            borderRight: '1px solid #e2e8f0', display: 'flex',
            flexDirection: 'column', overflow: 'hidden',
          }}
        >
          <SectionsPanel insertAtIndex={insertAtIndex} />
        </div>

        {/* Right: Preview Canvas */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: '#e2e8f0', overflow: 'auto', padding: '16px' }}>
          <div
            style={{
              width: VIEWPORT_WIDTHS[viewport],
              maxWidth: '100%',
              height: '100%',
              minHeight: '600px',
              background: '#fff',
              borderRadius: viewport === 'desktop' ? '4px' : '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              transition: 'width 0.3s ease',
              border: viewport !== 'desktop' ? '8px solid #1e293b' : 'none',
            }}
          >
            {!iframeReady && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#ff6c2f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Loading visual editor…
              </div>
            )}
            <iframe
              ref={iframeRef}
              src="/cms-preview"
              title="Live Preview"
              style={{ width: '100%', height: '100%', border: 'none', display: iframeReady ? 'block' : 'none' }}
            />
          </div>
        </div>
      </div>

      {/* ── Industry Starter Kits Modal ── */}
      {templatesModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => {
            if (!applyingTemplate) setTemplatesModalOpen(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '920px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              padding: '28px',
              color: '#f8fafc',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '24px' }}>📦</span>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                    Industry Starter Kits & Presets
                  </h2>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', maxWidth: '640px' }}>
                  Select an industry starter kit to instantly reconfigure this page with high-converting banners, value pillars, custom department categories, and content tailored to your merchant niche.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTemplatesModalOpen(false)}
                disabled={Boolean(applyingTemplate)}
                style={{
                  background: '#0f172a',
                  border: '1px solid #475569',
                  color: '#94a3b8',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Template Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
              {templatesList.map((tpl) => {
                const isApplying = applyingTemplate === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    style={{
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.2s, transform 0.2s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '28px' }}>
                          {tpl.id === 'hardware' ? '🔨' : tpl.id === 'electronics' ? '💻' : tpl.id === 'fashion' ? '👗' : tpl.id === 'grocery' ? '🛒' : tpl.id === 'general' ? '🏬' : '💎'}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: `${tpl.accentColor}25`, color: tpl.accentColor, border: `1px solid ${tpl.accentColor}50` }}>
                          {tpl.badge}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}>
                        {tpl.name}
                      </h3>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: tpl.accentColor, marginBottom: '8px' }}>
                        {tpl.industry}
                      </div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                        {tpl.tagline}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(tpl.id)}
                      disabled={Boolean(applyingTemplate)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isApplying ? '#6366f1' : tpl.accentColor,
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: applyingTemplate ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: `0 2px 8px ${tpl.accentColor}40`,
                        opacity: applyingTemplate && !isApplying ? 0.5 : 1,
                      }}
                    >
                      {isApplying ? (
                        <>
                          <span style={{ width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                          Applying Kit…
                        </>
                      ) : (
                        <>
                          <span>⚡</span> Apply Starter Kit
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
