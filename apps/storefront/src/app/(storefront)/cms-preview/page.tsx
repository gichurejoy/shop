'use client';

import React, { useEffect, useState } from 'react';
import { CmsSection } from '../../../lib/cms-types';
import { renderSection } from '../../../components/cms/SectionRenderer';

export default function CmsPreviewPage() {
  const [sections, setSections] = useState<CmsSection[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>();

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'INIT' || e.data?.type === 'UPDATE') {
        setSections(e.data.sections || []);
      }
      if (e.data?.type === 'SET_ACTIVE') {
        setActiveId(e.data.id);
      }
    };
    window.addEventListener('message', handler);
    // Tell parent we are ready
    window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        <p className="text-lg font-medium">Add sections on the left to start building</p>
      </div>
    );
  }

  const handleSectionClick = (id: string) => {
    window.parent.postMessage({ type: 'SECTION_CLICKED', id }, '*');
  };

  return (
    <div className="w-full">
      {sections.map(s => renderSection(s, activeId, handleSectionClick))}
    </div>
  );
}
