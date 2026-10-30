'use client';

import React, { useEffect, useState } from 'react';
import { getHomepageDraft, saveHomepageDraft, publishHomepage } from '../../../../actions';
import { CmsProvider } from '../../../../../components/cms/editor/cms-store';
import { EditorShell } from '../../../../../components/cms/editor/EditorShell';
import { CmsSection } from '../../../../../lib/cms-types';

export default function BuilderPage() {
  const [initialData, setInitialData] = useState<CmsSection[] | null>(null);

  useEffect(() => {
    getHomepageDraft().then(draft => {
      setInitialData(draft || []);
    });
  }, []);

  if (!initialData) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-400 flex-col gap-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="font-medium">Loading CMS Editor...</p>
      </div>
    );
  }

  return (
    <CmsProvider initial={initialData}>
      <EditorShell
        pageTitle="Homepage Builder"
        onSaveDraft={async (sections) => {
          await saveHomepageDraft(sections);
        }}
        onPublish={async () => {
          await publishHomepage();
        }}
      />
    </CmsProvider>
  );
}
