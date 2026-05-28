'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useCms } from './cms-store';
import { SectionsPanel } from './SectionsPanel';

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

export function EditorShell({
  pageTitle,
  onSaveDraft,
  onPublish,
}: {
  pageTitle: string;
  onSaveDraft: (sections: any[]) => Promise<void>;
  onPublish: () => Promise<void>;
}) {
  const { sections, isDirty, activeId, setActive, markSaved } = useCms();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [iframeReady, setIframeReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const sendTimer = useRef<NodeJS.Timeout | null>(null);

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
        // Send initial state
        iframeRef.current?.contentWindow?.postMessage({ type: 'INIT', sections }, '*');
      }
      if (e.data?.type === 'SECTION_CLICKED') {
        setActive(e.data.id);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [sections, setActive]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sections]);

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
          href="/"
          style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '14px' }}
          onClick={(e) => {
            if (isDirty && !confirm('You have unsaved changes. Leave?')) e.preventDefault();
            else { e.preventDefault(); window.location.href = '/'; }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back to Store
        </a>

        <div style={{ width: '1px', height: '24px', background: '#334155' }} />

        <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '14px' }}>{pageTitle}</span>

        {isDirty && (
          <span style={{ color: '#f59e0b', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                background: viewport === v ? '#3b82f6' : 'transparent',
                color: viewport === v ? '#fff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              {v === 'desktop' ? '🖥' : v === 'tablet' ? '📱' : '📲'} {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => window.open('/', '_blank')}
          style={{
            padding: '7px 16px', borderRadius: '8px', border: '1px solid #475569', background: 'transparent',
            color: '#cbd5e1', fontWeight: 500, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Preview Site
        </button>

        <button
          onClick={handleSaveDraft}
          disabled={saving}
          style={{
            padding: '7px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#334155',
            color: '#f1f5f9', fontWeight: 500, fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          {saving ? 'Saving…' : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save</>}
        </button>

        <button
          onClick={handlePublish}
          disabled={publishing}
          style={{
            padding: '7px 20px', borderRadius: '8px', border: 'none', background: publishing ? '#6366f1' : '#3b82f6',
            color: '#fff', fontWeight: 600, fontSize: '13px', cursor: publishing ? 'not-allowed' : 'pointer',
          }}
        >
          {publishing ? 'Publishing…' : '🚀 Publish'}
        </button>
      </div>

      {/* ── Main split view ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel */}
        <div
          style={{
            width: '360px', flexShrink: 0, background: '#fff',
            borderRight: '1px solid #e2e8f0', display: 'flex',
            flexDirection: 'column', overflow: 'hidden',
          }}
        >
          <SectionsPanel />
        </div>

        {/* Right: Preview */}
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
                <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Loading preview…
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
