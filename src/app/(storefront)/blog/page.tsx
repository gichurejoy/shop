import React from 'react';
import Link from 'next/link';
import { getCmsPosts } from '../../actions';
import { Calendar, User, ArrowRight, Tag, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Editorial & Journal | Waveron Journal',
  description: 'Stories on timeless craftsmanship, fine jewelry curation, and sustainable Mongolian cashmere.',
};

export default async function BlogIndexPage() {
  const allPosts = await getCmsPosts();
  const publishedPosts = allPosts.filter((p) => p.status === 'Published');

  const featuredPost = publishedPosts[0];
  const gridPosts = publishedPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-[#8B5A3C] uppercase mb-2 block">
            The Journal
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#3D2817] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Chronicles of Craft & Elegance
          </h1>
          <p className="text-gray-600 text-lg">
            Discover curated guides on heirloom metallurgy, ethical gemstone sourcing, and artisanal knitwear care.
          </p>
        </div>

        {/* Featured Story */}
        {featuredPost && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/60 hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                <img
                  src={featuredPost.featuredImage || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200'}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-[#8B5A3C] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Featured Story
                </span>
              </div>
              <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1 font-medium text-[#8B5A3C]">
                      <Tag className="w-3.5 h-3.5" />
                      {featuredPost.categories?.[0] || 'Editorial'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredPost.publishDate
                        ? new Date(featuredPost.publishDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Recent'}
                    </span>
                  </div>
                  <h2
                    className="text-2xl lg:text-3xl font-bold text-[#3D2817] mb-4 leading-snug hover:text-[#8B5A3C] transition-colors"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#EADDD0] flex items-center justify-center text-xs font-bold text-[#8B5A3C]">
                      {featuredPost.author.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-[#3D2817]">{featuredPost.author}</span>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B5A3C] uppercase tracking-wider hover:translate-x-1 transition-transform"
                  >
                    Read Story <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200/60 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.featuredImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  {post.categories?.[0] && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#3D2817] text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {post.categories[0]}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {post.publishDate
                        ? new Date(post.publishDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Recent'}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold text-[#3D2817] mb-2 leading-snug line-clamp-2 hover:text-[#8B5A3C] transition-colors"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-stone-100 mt-auto">
                <span className="text-xs text-gray-500 font-medium">By {post.author}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-[#8B5A3C] inline-flex items-center gap-1 hover:underline"
                >
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {publishedPosts.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-stone-200/60 p-8">
            <BookOpen className="w-12 h-12 text-[#8B5A3C] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-[#3D2817] mb-2">No Stories Published Yet</h3>
            <p className="text-gray-500 text-sm mb-6">Articles published from the CMS admin portal will appear here.</p>
            <Link
              href="/admin/cms/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B5A3C] text-white rounded-lg text-sm font-semibold hover:bg-[#6F4630] transition-colors"
            >
              Write First Story
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

