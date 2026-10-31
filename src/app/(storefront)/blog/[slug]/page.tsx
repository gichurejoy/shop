import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCmsPostBySlug, getCmsPosts } from '../../../actions';
import { Calendar, User, ArrowLeft, Tag, Share2, Clock } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getCmsPostBySlug(slug);

  if (!post || post.status !== 'Published') {
    return { title: 'Story Not Found | Waveron' };
  }

  return {
    title: `${post.seoTitle || post.title} | Waveron Journal`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getCmsPostBySlug(slug);

  if (!post || post.status !== 'Published') {
    notFound();
  }

  const allPosts = await getCmsPosts();
  const relatedPosts = allPosts
    .filter((p) => p.status === 'Published' && p.slug !== slug)
    .slice(0, 2);

  // Estimate read time (200 wpm)
  const wordCount = (post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="min-h-screen bg-[#FAF6F0] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8B5A3C] hover:text-[#3D2817] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>

        {/* Categories & Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          {post.categories?.map((cat) => (
            <span
              key={cat}
              className="bg-[#EADDD0] text-[#3D2817] font-semibold px-3 py-1 rounded-full text-xs"
            >
              {cat}
            </span>
          ))}
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.publishDate
              ? new Date(post.publishDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {readTime} min read
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3D2817] mb-6 leading-tight"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {post.title}
        </h1>

        {/* Author Byline */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3D2817] text-white flex items-center justify-center font-bold text-sm">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-[#3D2817]">{post.author}</p>
              <p className="text-xs text-gray-500">Contributing Editor</p>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className="prose prose-stone prose-lg max-w-none text-[#2C241D] leading-relaxed
            prose-headings:font-serif prose-headings:text-[#3D2817]
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:mb-6 prose-p:text-base prose-p:leading-8
            prose-li:text-base"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-stone-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Tags:</span>
            {post.tags.map((t) => (
              <span
                key={t}
                className="bg-white border border-stone-200 px-3 py-1 rounded-md text-xs text-gray-700"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-stone-300">
            <h3
              className="text-2xl font-bold text-[#3D2817] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Continue Reading
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="bg-white p-6 rounded-xl border border-stone-200/80 hover:shadow-md transition-shadow group block"
                >
                  <span className="text-xs font-semibold text-[#8B5A3C] uppercase tracking-wider block mb-2">
                    {rel.categories?.[0] || 'Editorial'}
                  </span>
                  <h4
                    className="font-bold text-lg text-[#3D2817] group-hover:text-[#8B5A3C] transition-colors mb-2 line-clamp-2"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {rel.title}
                  </h4>
                  <p className="text-gray-500 text-xs line-clamp-2">{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

