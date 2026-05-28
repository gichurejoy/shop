import fs from 'fs/promises';
import path from 'path';
import { CmsSection, CmsDraft } from './cms-types';

const DATA_FILE = path.join(process.cwd(), 'cms-data.json');

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
  try { await fs.access(DATA_FILE); }
  catch { await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2)); }
}

export async function getCmsData(): Promise<CmsData> {
  await ensureFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch { return DEFAULT_DATA; }
}

export async function saveCmsData(data: CmsData): Promise<void> {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}
