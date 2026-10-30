import React from 'react';
import { getCmsPageBySlug } from '../../actions';
import { notFound } from 'next/navigation';

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
  
  if (!page) {
    return {
      title: 'Page Not Found'
    };
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || '',
  };
}
