'use server';

import { revalidatePath } from 'next/cache';
import { getCmsData, saveCmsData, CmsPage, CmsPost } from '../lib/cms';
import { CmsSection } from '../lib/cms-types';

// ─── Homepage draft/publish ─────────────────────────────────────────────────
export async function getHomepageDraft(): Promise<CmsSection[]> {
  const data = await getCmsData();
  return data?.homepage?.draft?.sections || [];
}

export async function saveHomepageDraft(sections: CmsSection[]) {
  const data = await getCmsData();
  if (!data.homepage) data.homepage = { draft: { sections: [] }, published: { sections: [] } };
  data.homepage.draft = { sections };
  await saveCmsData(data);
  return { success: true };
}

export async function publishHomepage() {
  const data = await getCmsData();
  if (!data.homepage) data.homepage = { draft: { sections: [] }, published: { sections: [] } };
  data.homepage.published = { ...data.homepage.draft };
  await saveCmsData(data);
  revalidatePath('/');
  return { success: true };
}

export async function getHomepagePublished(): Promise<CmsSection[]> {
  const data = await getCmsData();
  return data?.homepage?.published?.sections || [];
}

// ─── Legacy block-based layout (kept for backwards compat) ──────────────────
export async function getHomepageLayout(): Promise<string[]> {
  const sections = await getHomepagePublished();
  return sections.map(s => s.type);
}

export async function saveHomepageLayout(blocks: string[]) {
  return { success: true }; // now handled by saveHomepageDraft/publishHomepage
}

// ─── Static pages ──────────────────────────────────────────────────────────
export async function getCmsPages(): Promise<CmsPage[]> {
  const data = await getCmsData();
  return data.pages;
}

export async function getCmsPageBySlug(slug: string): Promise<CmsPage | undefined> {
  const data = await getCmsData();
  return data.pages.find(p => p.slug === slug);
}

export async function saveCmsPage(page: Omit<CmsPage, 'id' | 'lastModified'> & { id?: string }) {
  const data = await getCmsData();
  if (page.id) {
    const idx = data.pages.findIndex(p => p.id === page.id);
    if (idx !== -1) {
      data.pages[idx] = { ...data.pages[idx], ...page, lastModified: new Date().toISOString() };
    } else {
      data.pages.push({ ...page, id: Date.now().toString(), lastModified: new Date().toISOString() });
    }
  } else {
    data.pages.push({ ...page, id: Date.now().toString(), lastModified: new Date().toISOString() });
  }
  await saveCmsData(data);
  revalidatePath(`/${page.slug}`);
  revalidatePath('/admin/cms/pages');
  return { success: true };
}

export async function deleteCmsPage(id: string) {
  const data = await getCmsData();
  data.pages = data.pages.filter(p => p.id !== id);
  await saveCmsData(data);
  revalidatePath('/admin/cms/pages');
  return { success: true };
}

// ─── Blog Posts ────────────────────────────────────────────────────────────
export async function getCmsPosts(): Promise<CmsPost[]> {
  const data = await getCmsData();
  return data.posts || [];
}

export async function getCmsPostBySlug(slug: string): Promise<CmsPost | undefined> {
  const data = await getCmsData();
  return (data.posts || []).find(p => p.slug === slug);
}

export async function saveCmsPost(post: Omit<CmsPost, 'id' | 'lastModified'> & { id?: string }) {
  const data = await getCmsData();
  if (!data.posts) data.posts = [];
  
  if (post.id) {
    const idx = data.posts.findIndex(p => p.id === post.id);
    if (idx !== -1) {
      data.posts[idx] = { ...data.posts[idx], ...post, lastModified: new Date().toISOString() };
    } else {
      data.posts.push({ ...post, id: Date.now().toString(), lastModified: new Date().toISOString() });
    }
  } else {
    data.posts.push({ ...post, id: Date.now().toString(), lastModified: new Date().toISOString() });
  }
  await saveCmsData(data);
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath('/admin/cms/blog');
  revalidatePath('/blog');
  return { success: true };
}

export async function deleteCmsPost(id: string) {
  const data = await getCmsData();
  if (!data.posts) return { success: true };
  data.posts = data.posts.filter(p => p.id !== id);
  await saveCmsData(data);
  revalidatePath('/admin/cms/blog');
  return { success: true };
}

// ─── Mega Menu / Navigation ────────────────────────────────────────────────
export async function getCmsNavigation() {
  const data = await getCmsData();
  return data.navigation || [];
}

export async function saveCmsNavigation(navigation: any[]) {
  const data = await getCmsData();
  data.navigation = navigation;
  await saveCmsData(data);
  revalidatePath('/');
  return { success: true };
}

// ─── SEO Settings ──────────────────────────────────────────────────────────
export async function getCmsSeoSettings() {
  const data = await getCmsData();
  return data.seo || { siteTitleTemplate: '', defaultMetaDescription: '', googleAnalyticsId: '', robotsTxt: '' };
}

export async function saveCmsSeoSettings(seo: any) {
  const data = await getCmsData();
  data.seo = seo;
  await saveCmsData(data);
  return { success: true };
}

// ─── Announcement Bar ──────────────────────────────────────────────────────
export async function getCmsAnnouncementBar() {
  const data = await getCmsData();
  return data.announcementBar || { visible: false, message: '', backgroundColor: '', textColor: '' };
}

export async function saveCmsAnnouncementBar(bar: any) {
  const data = await getCmsData();
  data.announcementBar = bar;
  await saveCmsData(data);
  revalidatePath('/');
  return { success: true };
}
