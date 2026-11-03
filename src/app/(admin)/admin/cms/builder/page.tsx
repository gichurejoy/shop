'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getPageDraft,
  savePageDraft,
  publishPage,
  getAllAvailablePages,
} from '../../../../actions';
import { CmsProvider } from '../../../../../components/cms/editor/cms-store';
import { EditorShell } from '../../../../../components/cms/editor/EditorShell';
import { CmsSection } from '@/lib/cms-types';
import { toast } from 'sonner';

function BuilderInner() {
  const searchParams = useSearchParams();
  const initialPage = searchParams.get('page') || 'home';
  const [currentPageSlug, setCurrentPageSlug] = useState(initialPage);
  const [availablePages, setAvailablePages] = useState<Array<{ slug: string; title: string; isSystem?: boolean }>>([]);
  const [initialData, setInitialData] = useState<CmsSection[] | null>(null);
  const [storeKey, setStoreKey] = useState(0);

  useEffect(() => {
    getAllAvailablePages().then((pages) => {
      setAvailablePages(pages);
    });
  }, []);

  useEffect(() => {
    let active = true;
    setInitialData(null);
    getPageDraft(currentPageSlug).then((draft) => {
      if (active) {
        setInitialData(draft || []);
      }
    });
    return () => {
      active = false;
    };
  }, [currentPageSlug]);

  const handleSwitchPage = async (newSlug: string) => {
    if (newSlug === currentPageSlug) return;
    setCurrentPageSlug(newSlug);
    window.history.pushState(null, '', `?page=${newSlug}`);
    setInitialData(null);
    const draft = await getPageDraft(newSlug);
    setInitialData(draft || []);
    setStoreKey((k) => k + 1);
  };

  const currentPageObj = availablePages.find((p) => p.slug === currentPageSlug);
  const pageTitle = currentPageObj ? currentPageObj.title : (currentPageSlug.charAt(0).toUpperCase() + currentPageSlug.slice(1));

  if (!initialData) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-slate-300 flex-col gap-4">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-[#ff6c2f] rounded-full animate-spin" />
        <p className="font-semibold text-sm tracking-wide">Loading Visual Builder for {pageTitle}...</p>
      </div>
    );
  }

  return (
    <CmsProvider key={`store-${currentPageSlug}-${storeKey}`} initial={initialData}>
      <EditorShell
        pageTitle={`${pageTitle} Builder`}
        currentPageSlug={currentPageSlug}
        availablePages={availablePages}
        onSwitchPage={handleSwitchPage}
        onSaveDraft={async (sections) => {
          await savePageDraft(currentPageSlug, sections);
          toast.success(`Draft saved for ${pageTitle}`);
        }}
        onPublish={async () => {
          await publishPage(currentPageSlug);
          toast.success(`🚀 Published ${pageTitle} live to storefront!`);
        }}
      />
    </CmsProvider>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-slate-900 text-slate-300 flex-col gap-4">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-[#ff6c2f] rounded-full animate-spin" />
          <p className="font-semibold text-sm">Initializing Visual Builder...</p>
        </div>
      }
    >
      <BuilderInner />
    </Suspense>
  );
}
