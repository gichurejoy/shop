import { prisma } from './prisma';
import { CmsSection } from './cms-types';

async function getDataFile() {
  if (typeof window !== 'undefined') return '';
  const path = await import('path');
  return path.join(process.cwd(), 'cms-data.json');
}

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: 'Published' | 'Draft';
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  lastModified: string;
};

export type CmsPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  author: string;
  categories: string[];
  tags: string[];
  featuredImage: string;
  seoTitle?: string;
  seoDescription?: string;
  publishDate?: string;
  lastModified: string;
};

export type CmsMenuNode = {
  id: string;
  label: string;
  link: string;
  isMega: boolean;
  children: CmsMenuNode[];
  badge?: string;
  badgeColor?: string;
};

export type CmsSeoSettings = {
  siteTitleTemplate: string;
  defaultMetaDescription: string;
  googleAnalyticsId: string;
  robotsTxt: string;
};

export type CmsAnnouncementBar = {
  visible: boolean;
  message: string;
  backgroundColor: string;
  textColor: string;
  link?: string;
};

export type CmsFooterLink = {
  id: string;
  label: string;
  url: string;
};

export type CmsFooterColumn = {
  id: string;
  title: string;
  links: CmsFooterLink[];
};

export type CmsFooterSettings = {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessHours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
  };
  columns: CmsFooterColumn[];
  copyrightText: string;
  showPaymentBadges: boolean;
  paymentMethods: string[];
  backgroundColor: string;
  textColor: string;
  accentColor: string;
};

export const DEFAULT_FOOTER_SETTINGS: CmsFooterSettings = {
  brandName: 'Waveron Store',
  tagline: 'Your trusted partner for high-quality goods, reliable tools, and exceptional customer service.',
  logoUrl: '',
  contactEmail: 'support@waveron.com',
  contactPhone: '+1 (800) 555-0199',
  address: '100 Commercial Blvd, Suite 400',
  businessHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com',
    linkedin: '',
    tiktok: '',
  },
  columns: [
    {
      id: 'col-1',
      title: 'Shop Departments',
      links: [
        { id: 'l1', label: 'All Products', url: '/products' },
        { id: 'l2', label: 'Featured Collections', url: '/products' },
        { id: 'l3', label: 'New Arrivals', url: '/products' },
        { id: 'l4', label: 'Weekly Specials', url: '/products' },
      ],
    },
    {
      id: 'col-2',
      title: 'Customer Support',
      links: [
        { id: 'l5', label: 'Order Tracking', url: '/tracking' },
        { id: 'l6', label: 'Shipping & Delivery Policy', url: '/care-guide' },
        { id: 'l7', label: 'Returns & Replacements', url: '/care-guide' },
        { id: 'l8', label: 'Help & FAQs', url: '/care-guide' },
      ],
    },
    {
      id: 'col-3',
      title: 'Company',
      links: [
        { id: 'l9', label: 'About Our Story', url: '/about' },
        { id: 'l10', label: 'Lookbook & Showcases', url: '/lookbook' },
        { id: 'l11', label: 'VIP Membership', url: '/membership' },
        { id: 'l12', label: 'Store Locations', url: '/about' },
      ],
    },
  ],
  copyrightText: '© 2026 Waveron Commerce. All rights reserved.',
  showPaymentBadges: true,
  paymentMethods: ['visa', 'mastercard', 'mpesa', 'paypal', 'applepay', 'cash'],
  backgroundColor: '#1E293B',
  textColor: '#94A3B8',
  accentColor: '#FF6C2F',
};

export type CmsData = {
  homepage: {
    draft: { sections: CmsSection[] };
    published: { sections: CmsSection[] };
  };
  pages: CmsPage[];
  posts: CmsPost[];
  navigation: CmsMenuNode[];
  seo: CmsSeoSettings;
  announcementBar: CmsAnnouncementBar;
  footer: CmsFooterSettings;
};

const DEFAULT_DATA: CmsData = {
  homepage: {
    draft: { sections: [] },
    published: { sections: [] },
  },
  pages: [],
  posts: [],
  navigation: [],
  seo: {
    siteTitleTemplate: '{page_title} | Store',
    defaultMetaDescription: '',
    googleAnalyticsId: '',
    robotsTxt: 'User-agent: *\nAllow: /'
  },
  announcementBar: {
    visible: false,
    message: 'Welcome to our store!',
    backgroundColor: '#000000',
    textColor: '#ffffff'
  },
  footer: DEFAULT_FOOTER_SETTINGS,
};

async function readFallbackFile(): Promise<CmsData> {
  if (typeof window !== 'undefined') return DEFAULT_DATA;
  try {
    const fs = await import('fs/promises');
    const dataFile = await getDataFile();
    const raw = await fs.readFile(dataFile, 'utf-8');
    return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DATA;
  }
}

async function writeFallbackFile(data: CmsData): Promise<void> {
  if (typeof window !== 'undefined') return;
  try {
    const fs = await import('fs/promises');
    const dataFile = await getDataFile();
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write CMS backup file:', err);
  }
}

export async function getCmsData(): Promise<CmsData> {
  try {
    const [publishedSections, draftSections, pages, posts, settings] = await Promise.all([
      prisma.cmsSection.findMany({
        where: { pageSlug: 'home' },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.cmsSection.findMany({
        where: { pageSlug: 'home-draft' },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.cmsPage.findMany({
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.cmsPost.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.cmsSetting.findMany(),
    ]);

    const settingsMap = new Map<string, any>(
      settings.map((s) => [s.key, s.value])
    );

    const mapSection = (s: any): CmsSection => ({
      ...(typeof s.config === 'object' && s.config !== null ? (s.config as object) : {}),
      id: s.id,
      type: s.type as any,
      visible: s.isVisible,
    }) as CmsSection;

    const mappedPublished: CmsSection[] = publishedSections.map(mapSection);
    const mappedDraft: CmsSection[] = draftSections.length > 0 
      ? draftSections.map(mapSection) 
      : mappedPublished;

    const mappedPages: CmsPage[] = pages.map((p) => ({
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

    const mappedPosts: CmsPost[] = posts.map((post) => ({
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

    return {
      homepage: {
        draft: { sections: mappedDraft },
        published: { sections: mappedPublished },
      },
      pages: mappedPages,
      posts: mappedPosts,
      navigation: settingsMap.get('navigation') || DEFAULT_DATA.navigation,
      seo: settingsMap.get('seo') || DEFAULT_DATA.seo,
      announcementBar: settingsMap.get('announcement-bar') || DEFAULT_DATA.announcementBar,
      footer: settingsMap.get('footer') || DEFAULT_FOOTER_SETTINGS,
    };
  } catch (err) {
    console.warn('Prisma getCmsData query failed, falling back to cms-data.json:', err);
    return await readFallbackFile();
  }
}

export async function saveCmsData(data: CmsData): Promise<void> {
  // Always update JSON backup first for instant file consistency
  await writeFallbackFile(data);

  try {
    const publishedSections = data.homepage?.published?.sections || [];
    const draftSections = data.homepage?.draft?.sections || [];

    // 1. Transaction to update homepage published & draft sections in MySQL
    await prisma.$transaction(async (tx) => {
      if (publishedSections.length > 0) {
        await tx.cmsSection.deleteMany({ where: { pageSlug: 'home' } });
        for (let i = 0; i < publishedSections.length; i++) {
          const s = publishedSections[i];
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
      }

      if (draftSections.length > 0) {
        await tx.cmsSection.deleteMany({ where: { pageSlug: 'home-draft' } });
        for (let i = 0; i < draftSections.length; i++) {
          const s = draftSections[i];
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
      }
    });

    // 2. Sync CMS Pages in MySQL
    if (Array.isArray(data.pages)) {
      for (const p of data.pages) {
        await prisma.cmsPage.upsert({
          where: { slug: p.slug },
          update: {
            title: p.title,
            content: p.content,
            status: p.status,
            seoTitle: p.seoTitle || null,
            seoDescription: p.seoDescription || null,
            ogImage: p.ogImage || null,
          },
          create: {
            id: p.id,
            slug: p.slug,
            title: p.title,
            content: p.content,
            status: p.status,
            seoTitle: p.seoTitle || null,
            seoDescription: p.seoDescription || null,
            ogImage: p.ogImage || null,
          },
        });
      }
    }

    // 3. Sync CMS Posts in MySQL
    if (Array.isArray(data.posts)) {
      for (const post of data.posts) {
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
            id: post.id,
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
      }
    }

    // 4. Sync Settings in MySQL
    if (data.navigation) {
      await prisma.cmsSetting.upsert({
        where: { key: 'navigation' },
        update: { value: data.navigation },
        create: { key: 'navigation', value: data.navigation },
      });
    }

    if (data.seo) {
      await prisma.cmsSetting.upsert({
        where: { key: 'seo' },
        update: { value: data.seo },
        create: { key: 'seo', value: data.seo },
      });
    }

    if (data.announcementBar) {
      await prisma.cmsSetting.upsert({
        where: { key: 'announcement-bar' },
        update: { value: data.announcementBar },
        create: { key: 'announcement-bar', value: data.announcementBar },
      });
    }

    if (data.footer) {
      await prisma.cmsSetting.upsert({
        where: { key: 'footer' },
        update: { value: data.footer },
        create: { key: 'footer', value: data.footer },
      });
    }
  } catch (err) {
    console.error('Failed to sync CMS data to MySQL:', err);
  }
}
