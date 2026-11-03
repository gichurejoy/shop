import React from 'react';
import { getCmsPageBySlug, getPagePublished } from '../../actions';
import { notFound } from 'next/navigation';
import { RenderSection } from '../../../components/cms/SectionRenderer';

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const publishedSections = await getPagePublished(slug);

  if (publishedSections && publishedSections.length > 0) {
    return (
      <div className="w-full">
        {publishedSections.map((s) => (
          <RenderSection key={s.id} s={s} />
        ))}
      </div>
    );
  }

  const page = await getCmsPageBySlug(slug);

  if (!page || page.status !== 'Published') {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 
        className="text-4xl md:text-5xl font-bold mb-8 text-gray-900"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {page.title}
      </h1>
      <div 
        className="prose prose-lg max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);
  
  if (page) {
    return {
      title: page.seoTitle || `${page.title} | Waveron Atelier`,
      description: page.seoDescription || '',
    };
  }

  const titles: Record<string, string> = {
    about: 'About Us | Waveron Atelier',
    'care-guide': 'Jewelry & Knitwear Care Guide | Waveron Atelier',
    lookbook: 'Lookbook & Editorial | Waveron Atelier',
    membership: 'VIP Membership & Atelier Privé | Waveron Atelier',
  };

  if (titles[slug]) {
    return { title: titles[slug] };
  }

  return {
    title: 'Page Not Found | Waveron Atelier',
  };
}
