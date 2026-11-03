'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCmsData, saveCmsData, CmsPage, CmsPost, CmsMenuNode, CmsSeoSettings, CmsAnnouncementBar } from '@/lib/cms';
import { CmsSection } from '@/lib/cms-types';

// ─── Homepage draft/publish ─────────────────────────────────────────────────
export async function getHomepageDraft(): Promise<CmsSection[]> {
  try {
    const draftSections = await prisma.cmsSection.findMany({
      where: { pageSlug: 'home-draft' },
      orderBy: { sortOrder: 'asc' },
    });
    if (draftSections.length > 0) {
      return draftSections.map((s) => ({
        ...(typeof s.config === 'object' && s.config !== null ? (s.config as object) : {}),
        id: s.id,
        type: s.type as any,
        visible: s.isVisible,
      })) as CmsSection[];
    }
  } catch (e) {
    console.warn('Could not fetch draft sections from MySQL, falling back:', e);
  }
  return getHomepagePublished();
}

export async function saveHomepageDraft(sections: CmsSection[]) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.cmsSection.deleteMany({ where: { pageSlug: 'home-draft' } });
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        await tx.cmsSection.create({
          data: {
            id: s.id || `draft-sec-${Date.now()}-${i}`,
            pageSlug: 'home-draft',
            type: s.type,
            title: (s as any).heading || (s as any).title || null,
            subtitle: (s as any).subheading || (s as any).subtitle || null,
            sortOrder: i,
            isVisible: s.visible !== false,
            config: s as any,
          },
        });
      }
    });
  } catch (err) {
    console.error('Failed to save homepage draft:', err);
  }
  return { success: true };
}

export async function publishHomepage() {
  try {
    const draft = await getHomepageDraft();
    await prisma.$transaction(async (tx) => {
      await tx.cmsSection.deleteMany({ where: { pageSlug: 'home' } });
      for (let i = 0; i < draft.length; i++) {
        const s = draft[i];
        await tx.cmsSection.create({
          data: {
            id: s.id || `sec-${Date.now()}-${i}`,
            pageSlug: 'home',
            type: s.type,
            title: (s as any).heading || (s as any).title || null,
            subtitle: (s as any).subheading || (s as any).subtitle || null,
            sortOrder: i,
            isVisible: s.visible !== false,
            config: s as any,
          },
        });
      }
    });
    revalidatePath('/');
  } catch (err) {
    console.error('Failed to publish homepage:', err);
  }
  return { success: true };
}

export async function getHomepagePublished(): Promise<CmsSection[]> {
  try {
    const sections = await prisma.cmsSection.findMany({
      where: { pageSlug: 'home' },
      orderBy: { sortOrder: 'asc' },
    });
    if (sections.length > 0) {
      return sections.map((s) => ({
        ...(typeof s.config === 'object' && s.config !== null ? (s.config as object) : {}),
        id: s.id,
        type: s.type as any,
        visible: s.isVisible,
      })) as CmsSection[];
    }
  } catch (e) {
    console.warn('Could not fetch published sections from MySQL:', e);
  }
  const data = await getCmsData();
  return data?.homepage?.published?.sections || [];
}

// ─── Legacy block-based layout (kept for backwards compat) ──────────────────
export async function getHomepageLayout(): Promise<string[]> {
  const sections = await getHomepagePublished();
  return sections.map(s => s.type);
}

export async function saveHomepageLayout(blocks: string[]) {
  return { success: true };
}

// ─── Static pages ──────────────────────────────────────────────────────────
export async function getCmsPages(): Promise<CmsPage[]> {
  try {
    const pages = await prisma.cmsPage.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    if (pages.length > 0) {
      return pages.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        content: p.content || '',
        status: (p.status as any) || 'Published',
        seoTitle: p.seoTitle || undefined,
        seoDescription: p.seoDescription || undefined,
        ogImage: p.ogImage || undefined,
        lastModified: p.updatedAt.toISOString(),
      }));
    }
  } catch (e) {
    console.warn('Could not fetch CMS pages from MySQL:', e);
  }
  const data = await getCmsData();
  return data.pages;
}

export async function getCmsPageBySlug(slug: string): Promise<CmsPage | undefined> {
  try {
    const page = await prisma.cmsPage.findUnique({
      where: { slug },
    });
    if (page) {
      return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content || '',
        status: (page.status as any) || 'Published',
        seoTitle: page.seoTitle || undefined,
        seoDescription: page.seoDescription || undefined,
        ogImage: page.ogImage || undefined,
        lastModified: page.updatedAt.toISOString(),
      };
    }
  } catch (e) {
    console.warn('Could not fetch CMS page by slug from MySQL:', e);
  }
  const data = await getCmsData();
  return data.pages.find(p => p.slug === slug);
}

export async function saveCmsPage(page: Omit<CmsPage, 'id' | 'lastModified'> & { id?: string }) {
  const pageId = page.id || `page-${Date.now()}`;
  try {
    await prisma.cmsPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content,
        status: page.status,
        seoTitle: page.seoTitle || null,
        seoDescription: page.seoDescription || null,
        ogImage: page.ogImage || null,
      },
      create: {
        id: pageId,
        slug: page.slug,
        title: page.title,
        content: page.content,
        status: page.status,
        seoTitle: page.seoTitle || null,
        seoDescription: page.seoDescription || null,
        ogImage: page.ogImage || null,
      },
    });
  } catch (e) {
    console.error('Failed to upsert CMS page in MySQL:', e);
  }

  // Also sync in-memory / fallback file
  const data = await getCmsData();
  const idx = data.pages.findIndex(p => p.slug === page.slug || (page.id && p.id === page.id));
  if (idx !== -1) {
    data.pages[idx] = { ...data.pages[idx], ...page, id: pageId, lastModified: new Date().toISOString() };
  } else {
    data.pages.push({ ...page, id: pageId, lastModified: new Date().toISOString() });
  }
  await saveCmsData(data);

  revalidatePath(`/${page.slug}`);
  revalidatePath('/admin/cms/pages');
  return { success: true };
}

export async function deleteCmsPage(id: string) {
  try {
    await prisma.cmsPage.delete({ where: { id } });
  } catch (err) {
    console.warn('Failed to delete CMS page from MySQL:', err);
  }
  const data = await getCmsData();
  data.pages = data.pages.filter(p => p.id !== id);
  await saveCmsData(data);
  revalidatePath('/admin/cms/pages');
  return { success: true };
}

// ─── Blog Posts ────────────────────────────────────────────────────────────
export async function getCmsPosts(): Promise<CmsPost[]> {
  try {
    const posts = await prisma.cmsPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (posts.length > 0) {
      return posts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content || '',
        excerpt: post.excerpt || '',
        status: (post.status as any) || 'Draft',
        author: post.author,
        categories: Array.isArray(post.categories) ? (post.categories as string[]) : [],
        tags: Array.isArray(post.tags) ? (post.tags as string[]) : [],
        featuredImage: post.featuredImage || '',
        seoTitle: post.seoTitle || undefined,
        seoDescription: post.seoDescription || undefined,
        publishDate: post.publishDate ? post.publishDate.toISOString() : undefined,
        lastModified: post.updatedAt.toISOString(),
      }));
    }
  } catch (e) {
    console.warn('Could not fetch CMS posts from MySQL:', e);
  }
  const data = await getCmsData();
  return data.posts || [];
}

export async function getCmsPostBySlug(slug: string): Promise<CmsPost | undefined> {
  try {
    const post = await prisma.cmsPost.findUnique({
      where: { slug },
    });
    if (post) {
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content || '',
        excerpt: post.excerpt || '',
        status: (post.status as any) || 'Draft',
        author: post.author,
        categories: Array.isArray(post.categories) ? (post.categories as string[]) : [],
        tags: Array.isArray(post.tags) ? (post.tags as string[]) : [],
        featuredImage: post.featuredImage || '',
        seoTitle: post.seoTitle || undefined,
        seoDescription: post.seoDescription || undefined,
        publishDate: post.publishDate ? post.publishDate.toISOString() : undefined,
        lastModified: post.updatedAt.toISOString(),
      };
    }
  } catch (e) {
    console.warn('Could not fetch CMS post by slug from MySQL:', e);
  }
  const data = await getCmsData();
  return (data.posts || []).find(p => p.slug === slug);
}

export async function saveCmsPost(post: Omit<CmsPost, 'id' | 'lastModified'> & { id?: string }) {
  const postId = post.id || `post-${Date.now()}`;
  try {
    await prisma.cmsPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt || null,
        content: post.content,
        status: post.status,
        author: post.author,
        featuredImage: post.featuredImage || null,
        categories: post.categories,
        tags: post.tags,
        publishDate: post.publishDate ? new Date(post.publishDate) : null,
      },
      create: {
        id: postId,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || null,
        content: post.content,
        status: post.status,
        author: post.author,
        featuredImage: post.featuredImage || null,
        categories: post.categories,
        tags: post.tags,
        publishDate: post.publishDate ? new Date(post.publishDate) : new Date(),
      },
    });
  } catch (e) {
    console.error('Failed to upsert CMS post in MySQL:', e);
  }

  const data = await getCmsData();
  if (!data.posts) data.posts = [];
  const idx = data.posts.findIndex(p => p.slug === post.slug || (post.id && p.id === post.id));
  if (idx !== -1) {
    data.posts[idx] = { ...data.posts[idx], ...post, id: postId, lastModified: new Date().toISOString() };
  } else {
    data.posts.push({ ...post, id: postId, lastModified: new Date().toISOString() });
  }
  await saveCmsData(data);

  revalidatePath(`/blog/${post.slug}`);
  revalidatePath('/admin/cms/blog');
  revalidatePath('/blog');
  return { success: true };
}

export async function deleteCmsPost(id: string) {
  try {
    await prisma.cmsPost.delete({ where: { id } });
  } catch (err) {
    console.warn('Failed to delete CMS post from MySQL:', err);
  }
  const data = await getCmsData();
  if (data.posts) data.posts = data.posts.filter(p => p.id !== id);
  await saveCmsData(data);
  revalidatePath('/admin/cms/blog');
  revalidatePath('/blog');
  return { success: true };
}

// ─── Mega Menu / Navigation ────────────────────────────────────────────────
export async function getCmsNavigation(): Promise<CmsMenuNode[]> {
  try {
    const setting = await prisma.cmsSetting.findUnique({
      where: { key: 'navigation' },
    });
    if (setting?.value && Array.isArray(setting.value)) {
      return setting.value as unknown as CmsMenuNode[];
    }
  } catch (e) {
    console.warn('Could not fetch navigation from MySQL:', e);
  }
  const data = await getCmsData();
  return (data.navigation || []) as CmsMenuNode[];
}

export async function saveCmsNavigation(navigation: any[]) {
  try {
    await prisma.cmsSetting.upsert({
      where: { key: 'navigation' },
      update: { value: navigation },
      create: { key: 'navigation', value: navigation },
    });
  } catch (e) {
    console.error('Failed to save navigation to MySQL:', e);
  }
  const data = await getCmsData();
  data.navigation = navigation;
  await saveCmsData(data);
  revalidatePath('/', 'layout');
  return { success: true };
}

// ─── SEO Settings ──────────────────────────────────────────────────────────
export async function getCmsSeoSettings(): Promise<CmsSeoSettings> {
  try {
    const setting = await prisma.cmsSetting.findUnique({
      where: { key: 'seo' },
    });
    if (setting?.value && typeof setting.value === 'object') {
      return setting.value as unknown as CmsSeoSettings;
    }
  } catch (e) {
    console.warn('Could not fetch SEO settings from MySQL:', e);
  }
  const data = await getCmsData();
  return (data.seo || { siteTitleTemplate: '', defaultMetaDescription: '', googleAnalyticsId: '', robotsTxt: '' }) as CmsSeoSettings;
}

export async function saveCmsSeoSettings(seo: any) {
  try {
    await prisma.cmsSetting.upsert({
      where: { key: 'seo' },
      update: { value: seo },
      create: { key: 'seo', value: seo },
    });
  } catch (e) {
    console.error('Failed to save SEO settings to MySQL:', e);
  }
  const data = await getCmsData();
  data.seo = seo;
  await saveCmsData(data);
  revalidatePath('/', 'layout');
  return { success: true };
}

// ─── Announcement Bar ──────────────────────────────────────────────────────
export async function getCmsAnnouncementBar(): Promise<CmsAnnouncementBar> {
  try {
    const setting = await prisma.cmsSetting.findUnique({
      where: { key: 'announcement-bar' },
    });
    if (setting?.value && typeof setting.value === 'object') {
      return setting.value as unknown as CmsAnnouncementBar;
    }
  } catch (e) {
    console.warn('Could not fetch announcement bar from MySQL:', e);
  }
  const data = await getCmsData();
  return (data.announcementBar || { visible: false, message: '', backgroundColor: '', textColor: '' }) as CmsAnnouncementBar;
}

export async function saveCmsAnnouncementBar(bar: any) {
  try {
    await prisma.cmsSetting.upsert({
      where: { key: 'announcement-bar' },
      update: { value: bar },
      create: { key: 'announcement-bar', value: bar },
    });
  } catch (e) {
    console.error('Failed to save announcement bar to MySQL:', e);
  }
  const data = await getCmsData();
  data.announcementBar = bar;
  await saveCmsData(data);
  revalidatePath('/', 'layout');
  return { success: true };
}
