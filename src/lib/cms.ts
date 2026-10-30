import { CmsSection, CmsDraft } from './cms-types';

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
  }
};

async function ensureFile() {
  if (typeof window !== 'undefined') return;
  const fs = await import('fs/promises');
  const dataFile = await getDataFile();
  try { await fs.access(dataFile); }
  catch { await fs.writeFile(dataFile, JSON.stringify(DEFAULT_DATA, null, 2)); }
}

export async function getCmsData(): Promise<CmsData> {
  if (typeof window !== 'undefined') return DEFAULT_DATA;
  const fs = await import('fs/promises');
  const dataFile = await getDataFile();
  await ensureFile();
  try {
    const raw = await fs.readFile(dataFile, 'utf-8');
    return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch { return DEFAULT_DATA; }
}

export async function saveCmsData(data: CmsData): Promise<void> {
  if (typeof window !== 'undefined') return;
  const fs = await import('fs/promises');
  const dataFile = await getDataFile();
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}
