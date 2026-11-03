"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CmsSection } from '@/lib/cms-types';
import { Hero } from '../Hero';
import { PromoCards } from '../PromoCards';
import { PromoBanner } from '../PromoBanner';
import { StylistBanner } from '../StylistBanner';
import { SeoContent } from '../SeoContent';
import { ProductGrid } from '../ProductGrid';
import { CategoryGrid } from '../CategoryGrid';
import { BrandStrip } from '../BrandStrip';
import { InlineText, InlineImage, InlineButton } from './editor/InlineWidgets';
import { Sparkles, User, Shield, Ruler, Search, MessageCircle } from 'lucide-react';

// ─── Renderers ───────────────────────────────────────────────────────────────

export function HeroRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  const bg: React.CSSProperties = {};
  if (s.backgroundType === 'image' && s.backgroundImage) {
    bg.backgroundImage = `url(${s.backgroundImage})`;
    bg.backgroundSize = 'cover';
    bg.backgroundPosition = 'center';
  } else if (s.backgroundType === 'gradient') {
    bg.background = `linear-gradient(135deg, ${s.gradientFrom}, ${s.gradientTo})`;
  } else {
    bg.backgroundColor = s.backgroundColor;
  }

  return (
    <div
      className="relative overflow-hidden flex items-center"
      style={{ ...bg, minHeight: `${s.minHeight}px`, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}
    >
      {s.overlayOpacity > 0 && (
        <div className="absolute inset-0" style={{ backgroundColor: s.overlayColor, opacity: s.overlayOpacity / 100 }} />
      )}
      {onUpdate && (
        <div className="absolute top-3 right-3 z-30">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.parent?.postMessage({
                type: 'ELEMENT_SELECTED',
                element: {
                  type: 'image',
                  sectionId: s.id,
                  field: 'backgroundImage',
                  url: s.backgroundImage || '',
                  label: 'Hero Background Image',
                }
              }, '*');
            }}
            className="bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur border border-white/20 transition-all cursor-pointer shadow-lg"
            title="Edit background image in inspector"
          >
            <span>📷</span>
            <span className="font-medium">Change Background</span>
          </button>
        </div>
      )}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 ${s.layout === 'centered' ? 'text-center' : ''}`}>
        <InlineText
          tagName="h1"
          value={s.heading || 'Hero Heading'}
          onUpdate={onUpdate ? (val) => onUpdate({ heading: val }) : undefined}
          className="font-bold mb-4 leading-tight block"
          style={{ fontSize: `${s.headingSize}px`, color: s.textColor, textAlign: s.textAlign }}
        />
        {s.subheading && (
          <InlineText
            tagName="p"
            value={s.subheading}
            onUpdate={onUpdate ? (val) => onUpdate({ subheading: val }) : undefined}
            className="text-lg mb-8 opacity-90 block"
            style={{ color: s.textColor, textAlign: s.textAlign }}
          />
        )}
        <div style={{ textAlign: s.textAlign }}>
          {s.cta1Label && (
            <InlineButton
              label={s.cta1Label}
              link={s.cta1Link || '#'}
              styleVariant={s.cta1Style || 'filled'}
              color={s.cta1Color || '#ff6c2f'}
              sectionId={s.id}
              labelField="cta1Label"
              linkField="cta1Link"
              styleField="cta1Style"
              colorField="cta1Color"
              className="inline-block px-8 py-3 rounded-lg font-semibold mr-3 transition-all"
              onUpdate={onUpdate ? (patch) => onUpdate({ cta1Label: patch.label, cta1Link: patch.link, cta1Style: patch.style, cta1Color: patch.color }) : undefined}
            />
          )}
          {s.cta2Label && (
            <InlineButton
              label={s.cta2Label}
              link={s.cta2Link || '#'}
              styleVariant={s.cta2Style || 'filled'}
              color={s.cta2Color || '#ffffff'}
              sectionId={s.id}
              labelField="cta2Label"
              linkField="cta2Link"
              styleField="cta2Style"
              colorField="cta2Color"
              className="inline-block px-8 py-3 rounded-lg font-semibold border-2 transition-all"
              onUpdate={onUpdate ? (patch) => onUpdate({ cta2Label: patch.label, cta2Link: patch.link, cta2Style: patch.style, cta2Color: patch.color }) : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function FeaturedProductsRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  const cols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5' }[s.columns as number] || 'grid-cols-4';
  const mockProducts = Array.from({ length: Math.min(s.maxProducts, 8) }, (_, i) => i);
  return (
    <div style={{ backgroundColor: s.backgroundColor, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6">
        {s.title && (
          <InlineText
            tagName="h2"
            value={s.title}
            onUpdate={onUpdate ? (val) => onUpdate({ title: val }) : undefined}
            className="text-3xl font-bold text-center mb-2 text-gray-900 block"
          />
        )}
        {s.subtitle && (
          <InlineText
            tagName="p"
            value={s.subtitle}
            onUpdate={onUpdate ? (val) => onUpdate({ subtitle: val }) : undefined}
            className="text-center text-gray-500 mb-8 block"
          />
        )}
        <div className={`grid ${cols} gap-6`}>
          {mockProducts.map(i => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="bg-gray-100 aspect-square" />
              <div className="p-3">
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                {s.showPrice && <div className="h-4 bg-orange-100 rounded mt-2 w-1/3" />}
              </div>
            </div>
          ))}
        </div>
        {s.viewAllLabel && (
          <div className="text-center mt-8">
            <a
              href={s.viewAllLink || '#'}
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium"
              onClick={e => { if (onUpdate) e.preventDefault(); }}
            >
              <InlineText
                value={s.viewAllLabel}
                onUpdate={onUpdate ? (val) => onUpdate({ viewAllLabel: val }) : undefined}
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function CategoryGridRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  const cols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 6: 'grid-cols-6' }[s.columns as number] || 'grid-cols-4';
  const mockCats = ['Fashion', 'Electronics', 'Home', 'Sports', 'Beauty', 'Books'];
  return (
    <div style={{ paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6">
        {s.title && (
          <InlineText
            tagName="h2"
            value={s.title}
            onUpdate={onUpdate ? (val) => onUpdate({ title: val }) : undefined}
            className="text-3xl font-bold text-center mb-8 text-gray-900 block"
          />
        )}
        <div className={`grid ${cols} gap-4`}>
          {mockCats.slice(0, s.columns).map((cat, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl bg-gray-200 cursor-pointer group">
              <div className="aspect-square" style={{ background: `hsl(${i * 60}, 40%, 70%)` }} />
              <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                <span className="text-white font-semibold text-lg">{cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FlashSaleRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  const bg: React.CSSProperties = s.backgroundType === 'gradient'
    ? { background: `linear-gradient(135deg, ${s.gradientFrom}, ${s.gradientTo})` }
    : { backgroundColor: s.backgroundColor };
  const end = new Date(s.endDate);
  const now = new Date();
  const diff = Math.max(0, end.getTime() - now.getTime());
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return (
    <div style={{ ...bg, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        {s.bannerLabel && (
          <span className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: s.textColor }}>
            <InlineText
              value={s.bannerLabel}
              onUpdate={onUpdate ? (val) => onUpdate({ bannerLabel: val }) : undefined}
            />
          </span>
        )}
        {s.title && (
          <InlineText
            tagName="h2"
            value={s.title}
            onUpdate={onUpdate ? (val) => onUpdate({ title: val }) : undefined}
            className="text-4xl font-bold mb-6 block"
            style={{ color: s.textColor }}
          />
        )}
        <div className="flex justify-center gap-4">
          {[{ v: hours, l: 'Hours' }, { v: mins, l: 'Minutes' }, { v: secs, l: 'Seconds' }].map(({ v, l }) => (
            <div key={l} className="rounded-xl p-4 min-w-[80px]" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <div className="text-4xl font-bold" style={{ color: s.textColor }}>{String(v).padStart(2, '0')}</div>
              <div className="text-sm mt-1 opacity-75" style={{ color: s.textColor }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatsRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  const handleUpdateItem = (itemId: string, field: string, newValue: string) => {
    const newItems = s.items.map((item: any) => 
      item.id === itemId ? { ...item, [field]: newValue } : item
    );
    onUpdate?.({ items: newItems });
  };

  return (
    <div style={{ backgroundColor: s.backgroundColor, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-wrap justify-center gap-8 ${s.layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-4' : ''}`}>
          {(s.items || []).map((item: any) => (
            <div key={item.id} className="text-center flex-1 min-w-[120px]">
              <div className="text-3xl mb-2">{item.icon}</div>
              <InlineText
                tagName="div"
                value={item.number}
                onUpdate={onUpdate ? (val) => handleUpdateItem(item.id, 'number', val) : undefined}
                className="text-xl font-bold text-gray-900 block"
              />
              <InlineText
                tagName="div"
                value={item.label}
                onUpdate={onUpdate ? (val) => handleUpdateItem(item.id, 'label', val) : undefined}
                className="text-sm text-gray-500 block"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NewsletterRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  const bg: React.CSSProperties = s.backgroundType === 'gradient'
    ? { background: `linear-gradient(135deg, ${s.backgroundColor}, ${s.backgroundColor}cc)` }
    : s.backgroundType === 'image' && s.backgroundImage
    ? { backgroundImage: `url(${s.backgroundImage})`, backgroundSize: 'cover' }
    : { backgroundColor: s.backgroundColor };
  return (
    <div style={{ ...bg, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <InlineText
          tagName="h2"
          value={s.heading}
          onUpdate={onUpdate ? (val) => onUpdate({ heading: val }) : undefined}
          className="text-3xl font-bold text-white mb-2 block"
        />
        {s.subtext && (
          <InlineText
            tagName="p"
            value={s.subtext}
            onUpdate={onUpdate ? (val) => onUpdate({ subtext: val }) : undefined}
            className="text-white/80 mb-6 block"
          />
        )}
        <div className="flex gap-2 max-w-md mx-auto">
          <input 
            placeholder={s.placeholder} 
            className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none" 
            readOnly
          />
          <button 
            className="px-6 py-3 rounded-lg font-semibold text-white" 
            style={{ backgroundColor: s.buttonColor }}
            onClick={e => { if (onUpdate) e.preventDefault(); }}
          >
            <InlineText
              value={s.buttonLabel}
              onUpdate={onUpdate ? (val) => onUpdate({ buttonLabel: val }) : undefined}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  const handleUpdateTestimonial = (itemId: string, field: string, newValue: string) => {
    const newItems = (s.items || []).map((item: any) => 
      item.id === itemId ? { ...item, [field]: newValue } : item
    );
    onUpdate?.({ items: newItems });
  };

  return (
    <div style={{ backgroundColor: s.backgroundColor, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6">
        {s.title && (
          <InlineText
            tagName="h2"
            value={s.title}
            onUpdate={onUpdate ? (val) => onUpdate({ title: val }) : undefined}
            className="text-3xl font-bold text-center mb-8 text-gray-900 block"
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(s.items || []).map((item: any) => (
            <div key={item.id} className={`p-6 rounded-xl ${s.cardStyle === 'shadowed' ? 'shadow-lg' : s.cardStyle === 'bordered' ? 'border-2 border-gray-200' : ''} bg-white`}>
              <div className="flex mb-3">{'⭐'.repeat(item.rating)}</div>
              <p className="text-gray-700 mb-4 italic">
                "
                <InlineText
                  value={item.text}
                  onUpdate={onUpdate ? (val) => handleUpdateTestimonial(item.id, 'text', val) : undefined}
                />
                "
              </p>
              <InlineText
                tagName="div"
                value={item.name}
                onUpdate={onUpdate ? (val) => handleUpdateTestimonial(item.id, 'name', val) : undefined}
                className="font-semibold text-gray-900 block"
              />
              {item.company && (
                <InlineText
                  tagName="div"
                  value={item.company}
                  onUpdate={onUpdate ? (val) => handleUpdateTestimonial(item.id, 'company', val) : undefined}
                  className="text-sm text-gray-500 block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VideoRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  const getEmbedUrl = () => {
    if (!s.videoUrl) return '';
    if (s.videoType === 'youtube') {
      const id = s.videoUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=${s.autoplay ? 1 : 0}&mute=${s.muted ? 1 : 0}&loop=${s.loop ? 1 : 0}` : '';
    }
    return s.videoUrl;
  };
  return (
    <div style={{ paddingTop: s.paddingTop, paddingBottom: s.paddingBottom, backgroundColor: '#000' }}>
      <div className={s.layout === 'contained' ? 'max-w-4xl mx-auto px-6' : ''}>
        <div className="relative aspect-video bg-gray-900 overflow-hidden rounded-xl">
          {getEmbedUrl() ? (
            <iframe src={getEmbedUrl()} className="w-full h-full" allow="autoplay" />
          ) : (
            <div className="flex items-center justify-center h-full text-white/50 text-lg">Video Preview</div>
          )}
          {s.overlayText && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <InlineText
                tagName="p"
                value={s.overlayText}
                onUpdate={onUpdate ? (val) => onUpdate({ overlayText: val }) : undefined}
                className="text-white text-2xl font-bold block"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomHtmlRenderer({ s }: { s: any }) {
  return (
    <div
      style={{ paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}
      dangerouslySetInnerHTML={{ __html: s.html }}
    />
  );
}

export function BrandStripRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  return (
    <div style={{ paddingTop: s.paddingTop, paddingBottom: s.paddingBottom, backgroundColor: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto px-6">
        {s.title && (
          <InlineText
            tagName="h2"
            value={s.title}
            onUpdate={onUpdate ? (val) => onUpdate({ title: val }) : undefined}
            className="text-2xl font-bold text-center mb-6 text-gray-700 block"
          />
        )}
        <div className="flex gap-8 items-center justify-center flex-wrap">
          {!s.brands || s.brands.length === 0
            ? ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4', 'Brand 5'].map((b, i) => (
                <div key={i} className="h-12 px-6 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-medium">{b}</div>
              ))
            : s.brands.map((b: any) => (
                <img key={b.id} src={b.logo} alt={b.name} className="h-12 object-contain grayscale hover:grayscale-0 transition-all" />
              ))
          }
        </div>
      </div>
    </div>
  );
}

export function RichContentRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  return (
    <div style={{ backgroundColor: s.backgroundColor, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={s.layout === 'two-col' ? 'grid grid-cols-2 gap-8' : s.layout === 'three-col' ? 'grid grid-cols-3 gap-8' : ''}>
          {s.blocks.map((block: any) => (
            <div key={block.id} className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.content }} />
          ))}
        </div>
        {s.ctaLabel && (
          <div className="text-center mt-8">
            <a
              href={s.ctaLink || '#'}
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-medium"
              onClick={e => { if (onUpdate) e.preventDefault(); }}
            >
              <InlineText
                value={s.ctaLabel}
                onUpdate={onUpdate ? (val) => onUpdate({ ctaLabel: val }) : undefined}
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Bespoke Storefront Inline Renderers ────────────────────────────────────

function BespokeHeroRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  if (!onUpdate) {
    return (
      <Hero 
        heading={s.heading} 
        searchPlaceholder={s.subheading}
        backgroundColor={s.backgroundColor}
        backgroundImage={s.backgroundImage}
      />
    );
  }
  const customStyle: React.CSSProperties = {};
  if (s.backgroundImage) {
    customStyle.backgroundImage = `url(${s.backgroundImage})`;
    customStyle.backgroundSize = 'cover';
    customStyle.backgroundPosition = 'center';
  } else if (s.backgroundColor) {
    customStyle.backgroundColor = s.backgroundColor;
  }

  return (
    <div className="w-full bg-[#5C3A24] text-white py-12 relative overflow-hidden group/hero" style={customStyle}>
      <div className="absolute top-3 right-3 z-30">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.parent?.postMessage({
              type: 'ELEMENT_SELECTED',
              element: {
                type: 'image',
                sectionId: s.id,
                field: 'backgroundImage',
                url: s.backgroundImage || '',
                label: 'Hero Background Image',
              }
            }, '*');
          }}
          className="bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur border border-white/20 transition-all cursor-pointer shadow-lg"
          title="Edit background image in inspector"
        >
          <span>📷</span>
          <span className="font-medium">Change Background</span>
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6">
          <InlineText
            tagName="h2"
            value={s.heading || 'Shop Jewelry & Knitwear'}
            onUpdate={(val) => onUpdate({ heading: val })}
            className="text-3xl md:text-4xl font-bold mb-2 text-white block"
            style={{ fontFamily: 'Playfair Display, serif' }}
          />
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5A3C] pointer-events-none" />
            <div className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-gray-800 text-sm border-2 border-transparent shadow-md flex items-center">
              <InlineText
                value={s.subheading || 'Search rings, necklaces, sweaters...'}
                onUpdate={(val) => onUpdate({ subheading: val })}
                className="text-gray-500 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BespokePromoCardsRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  if (!onUpdate) {
    return (
      <PromoCards 
        card1Title={s.card1Title}
        card1Subtitle={s.card1Subtitle}
        card1Link={s.card1Link}
        card1Badge={s.card1Badge}
        card1Bg={s.card1Bg}
        card2Title={s.card2Title}
        card2Subtitle={s.card2Subtitle}
        card2Link={s.card2Link}
        card2Badge={s.card2Badge}
        card2Bg={s.card2Bg}
        card3Title={s.card3Title}
        card3Subtitle={s.card3Subtitle}
        card3Link={s.card3Link}
        card3Badge={s.card3Badge}
        card3Bg={s.card3Bg}
        card4Title={s.card4Title}
        card4Subtitle={s.card4Subtitle}
        card4Link={s.card4Link}
        card4Badge={s.card4Badge}
        card4Bg={s.card4Bg}
      />
    );
  }

  const cards = [
    { key: 1, icon: Sparkles, titleKey: 'card1Title', subKey: 'card1Subtitle', badgeKey: 'card1Badge', defaultTitle: 'Get 20%* off on Jewelry', defaultSub: 'SHOP NOW', defaultBadge: 'New', defaultBg: 'bg-[#E8F0E5]' },
    { key: 2, icon: User, titleKey: 'card2Title', subKey: 'card2Subtitle', badgeKey: 'card2Badge', defaultTitle: 'Personal Stylist', defaultSub: 'BOOK NOW', defaultBadge: '', defaultBg: 'bg-[#EDE7F3]' },
    { key: 3, icon: Shield, titleKey: 'card3Title', subKey: 'card3Subtitle', badgeKey: 'card3Badge', defaultTitle: 'Care Plan', defaultSub: 'EXPLORE PLANS', defaultBadge: 'New', defaultBg: 'bg-[#FCEFE3]' },
    { key: 4, icon: Ruler, titleKey: 'card4Title', subKey: 'card4Subtitle', badgeKey: 'card4Badge', defaultTitle: 'Free Sizing', defaultSub: 'AT HOME', defaultBadge: '', defaultBg: 'bg-[#E8F4F8]' },
  ];

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(c => {
            const Icon = c.icon;
            const title = s[c.titleKey] || c.defaultTitle;
            const sub = s[c.subKey] || c.defaultSub;
            const badge = s[c.badgeKey] !== undefined ? s[c.badgeKey] : c.defaultBadge;
            const bg = s[`card${c.key}Bg`] || c.defaultBg;

            return (
              <div key={c.key} className={`${bg} rounded-xl p-4 flex items-center justify-between border border-black/5 hover:shadow-md transition-all`}>
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#8B5A3C] shadow-sm shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <InlineText
                      tagName="h3"
                      value={title}
                      onUpdate={(val) => onUpdate({ [c.titleKey]: val })}
                      className="font-bold text-sm text-gray-900 block"
                    />
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <InlineText
                        value={sub}
                        onUpdate={(val) => onUpdate({ [c.subKey]: val })}
                        className="text-xs font-semibold text-[#8B5A3C]"
                      />
                      {badge && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#8B5A3C] text-white rounded font-medium">
                          <InlineText
                            value={badge}
                            onUpdate={(val) => onUpdate({ [c.badgeKey]: val })}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BespokePromoBannerRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  if (!onUpdate) {
    return (
      <PromoBanner 
        title={s.title}
        description={s.description}
        ctaLabel={s.ctaLabel}
        ctaLink={s.ctaLink}
      />
    );
  }

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#3D2817] rounded-2xl p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <InlineText
              tagName="h2"
              value={s.title || 'Save Up to 25% on Premium Collections'}
              onUpdate={(val) => onUpdate({ title: val })}
              className="text-2xl md:text-3xl font-bold mb-3 text-[#D4A574] block"
              style={{ fontFamily: 'Playfair Display, serif' }}
            />
            <div className="text-sm md:text-base mb-5 opacity-90 max-w-2xl mx-auto">
              <InlineText
                value={s.description || 'Exclusive offers on handcrafted jewelry and luxury knitwear'}
                onUpdate={(val) => onUpdate({ description: val })}
              />
            </div>
            <InlineButton
              label={s.ctaLabel || 'Shop Now'}
              link={s.ctaLink || '/products'}
              color="#8B5A3C"
              styleVariant="filled"
              sectionId={s.id}
              labelField="ctaLabel"
              linkField="ctaLink"
              className="px-8 py-2.5 rounded-lg font-bold shadow-md"
              onUpdate={(patch) => onUpdate({ ctaLabel: patch.label, ctaLink: patch.link })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BespokeStylistBannerRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  if (!onUpdate) {
    return (
      <StylistBanner 
        title={s.title} 
        description={s.description} 
        ctaLabel={s.ctaLabel} 
      />
    );
  }

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF6F0] border border-[#8B5A3C]/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <InlineText
              tagName="h2"
              value={s.title || 'Ask Anything About Your Style'}
              onUpdate={(val) => onUpdate({ title: val })}
              className="text-2xl font-bold mb-3 text-[#3D2817] block"
              style={{ fontFamily: 'Playfair Display, serif' }}
            />
            <div className="text-gray-700 text-sm mb-5 max-w-xl">
              <InlineText
                value={s.description || 'Our expert stylists are here to help you find the perfect piece for any occasion. Get personalized recommendations for jewelry and knitwear that match your unique style.'}
                onUpdate={(val) => onUpdate({ description: val })}
                multiline
              />
            </div>
            <InlineButton
              label={s.ctaLabel || 'Chat with a Stylist'}
              link="/membership"
              color="#8B5A3C"
              styleVariant="filled"
              sectionId={s.id}
              labelField="ctaLabel"
              className="px-6 py-2.5 rounded-lg font-bold shadow-sm"
              onUpdate={(patch) => onUpdate({ ctaLabel: patch.label })}
            />
          </div>
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
            <MessageCircle className="w-12 h-12 text-[#8B5A3C]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BespokeSeoContentRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  if (!onUpdate) {
    return (
      <SeoContent 
        title1={s.title1} 
        body1={s.body1}
        title2={s.title2}
        body2={s.body2}
        title3={s.title3}
        body3={s.body3}
      />
    );
  }

  return (
    <div className="w-full py-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-sm max-w-none text-gray-600">
          <InlineText
            tagName="h2"
            value={s.title1 || 'Premium Jewelry & Luxury Knitwear'}
            onUpdate={(val) => onUpdate({ title1: val })}
            className="text-xl font-bold mb-3 text-[#3D2817] block"
            style={{ fontFamily: 'Playfair Display, serif' }}
          />
          <div className="mb-5">
            <InlineText
              value={s.body1 || 'Discover our curated collection of handcrafted jewelry and premium knitwear. From timeless gold pieces to cozy cashmere sweaters, each item is selected for quality, craftsmanship, and enduring style.'}
              onUpdate={(val) => onUpdate({ body1: val })}
              multiline
            />
          </div>
          <InlineText
            tagName="h2"
            value={s.title2 || 'Jewelry Care Guide'}
            onUpdate={(val) => onUpdate({ title2: val })}
            className="text-xl font-bold mb-3 mt-6 text-[#3D2817] block"
            style={{ fontFamily: 'Playfair Display, serif' }}
          />
          <div className="mb-5 text-sm">
            <InlineText
              value={s.body2 || 'Proper care ensures your jewelry maintains its brilliance for years. Store pieces separately in soft pouches to prevent scratching. Clean gold and diamond jewelry with warm water and mild soap, using a soft brush for intricate details.'}
              onUpdate={(val) => onUpdate({ body2: val })}
              multiline
            />
          </div>
          <InlineText
            tagName="h2"
            value={s.title3 || 'Custom Sizing & Bespoke Orders'}
            onUpdate={(val) => onUpdate({ title3: val })}
            className="text-xl font-bold mb-3 mt-6 text-[#3D2817] block"
            style={{ fontFamily: 'Playfair Display, serif' }}
          />
          <div className="mb-5 text-sm">
            <InlineText
              value={s.body3 || 'We offer personalized consultations and bespoke tailoring for rings, bracelets, and cashmere garments to ensure a flawless fit.'}
              onUpdate={(val) => onUpdate({ body3: val })}
              multiline
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BespokeCategoryGridRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  if (!onUpdate) {
    return (
      <CategoryGrid 
        title={s.title} 
        cat1Label={s.cat1Label}
        cat2Label={s.cat2Label}
        cat3Label={s.cat3Label}
        cat4Label={s.cat4Label}
        cat5Label={s.cat5Label}
        cat6Label={s.cat6Label}
        cat7Label={s.cat7Label}
        cat8Label={s.cat8Label}
        cat9Label={s.cat9Label}
        cat10Label={s.cat10Label}
      />
    );
  }

  const defaultCats = [
    { key: 'cat1Label', name: s.cat1Label || 'Earrings', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80' },
    { key: 'cat2Label', name: s.cat2Label || 'Necklaces', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80' },
    { key: 'cat3Label', name: s.cat3Label || 'Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80' },
    { key: 'cat4Label', name: s.cat4Label || 'Bracelets', img: 'https://images.unsplash.com/photo-1611591475152-47796d194541?auto=format&fit=crop&w=400&q=80' },
    { key: 'cat5Label', name: s.cat5Label || 'Sweaters', img: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=400&q=80' },
    { key: 'cat6Label', name: s.cat6Label || 'Cardigans', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="w-full py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <InlineText
            tagName="h2"
            value={s.title || 'Explore by Category'}
            onUpdate={(val) => onUpdate({ title: val })}
            className="text-2xl md:text-3xl font-bold text-[#3D2817] block"
            style={{ fontFamily: 'Playfair Display, serif' }}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {defaultCats.map(cat => (
            <div key={cat.key} className="group relative rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all text-center p-3 bg-[#FAF6F0]">
              <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <InlineText
                value={cat.name}
                onUpdate={(val) => onUpdate({ [cat.key]: val })}
                className="font-bold text-xs text-[#3D2817] block"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BespokeProductGridRenderer({ s, onUpdate }: { s: any; onUpdate?: (patch: any) => void }) {
  return (
    <div className="w-full py-10" style={{ backgroundColor: s.backgroundColor || '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <InlineText
            tagName="h2"
            value={s.title || 'Featured Collections'}
            onUpdate={onUpdate ? (val) => onUpdate({ title: val }) : undefined}
            className="text-2xl md:text-3xl font-bold text-[#3D2817] block"
            style={{ fontFamily: 'Playfair Display, serif' }}
          />
        </div>
        <ProductGrid 
          title="" 
          limit={s.maxProducts || 8}
          columns={s.columns}
          showPrice={s.showPrice}
          showRating={s.showRating}
          showAddToCart={s.showAddToCart}
          showDiscountBadge={s.showDiscountBadge}
          backgroundColor={s.backgroundColor}
        />
      </div>
    </div>
  );
}

// ─── Main RenderSection Switch ───────────────────────────────────────────────

export function RenderSection({
  s,
  activeId,
  onClick,
  onUpdateSection,
}: {
  s: CmsSection;
  activeId?: string;
  onClick?: (id: string) => void;
  onUpdateSection?: (id: string, patch: Partial<CmsSection>) => void;
}) {
  if (!s.visible) return null;
  const isActive = s.id === activeId;
  const wrapperProps: any = {
    'data-section-id': s.id,
  };

  if (onClick) {
    wrapperProps.onClick = () => onClick(s.id);
    wrapperProps.style = {
      outline: isActive ? '3px solid #ff6c2f' : '3px solid transparent',
      outlineOffset: '-3px',
      transition: 'outline 0.15s',
      cursor: 'default',
      position: 'relative',
    };
  }

  let variantClass = '';
  if (s.variant === 'light') variantClass = 'bg-[#FAF6F0] text-[#3D2817]';
  else if (s.variant === 'dark') variantClass = 'bg-[#3D2817] text-white';
  else if (s.variant === 'minimal') variantClass = 'bg-white text-gray-900 border-y border-gray-100';

  const wrapper = (children: React.ReactNode) => (
    <div key={s.id} {...wrapperProps} className={variantClass}>
      {isActive && onClick && (
        <div className="absolute top-2 left-2 z-50 bg-[#ff6c2f] text-white text-xs px-2.5 py-1 rounded font-semibold shadow pointer-events-none">
          {s.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </div>
      )}
      {children}
    </div>
  );
  
  const updateHandler = onUpdateSection ? (patch: any) => onUpdateSection(s.id, patch) : undefined;

  switch (s.type) {
    case 'hero': 
      return wrapper(<BespokeHeroRenderer s={s} onUpdate={updateHandler} />);
    case 'promo-cards': 
      return wrapper(<BespokePromoCardsRenderer s={s} onUpdate={updateHandler} />);
    case 'category-grid': 
      return wrapper(<BespokeCategoryGridRenderer s={s} onUpdate={updateHandler} />);
    case 'featured-products': 
      return wrapper(<BespokeProductGridRenderer s={s} onUpdate={updateHandler} />);
    case 'promo-banner': 
      return wrapper(<BespokePromoBannerRenderer s={s} onUpdate={updateHandler} />);
    case 'brand-strip': 
      return wrapper(<BrandStrip title={(s as any).title} brands={(s as any).brands} />);
    case 'stylist-banner': 
      return wrapper(<BespokeStylistBannerRenderer s={s} onUpdate={updateHandler} />);
    case 'seo-content': 
      return wrapper(<BespokeSeoContentRenderer s={s} onUpdate={updateHandler} />);
    
    case 'flash-sale': 
      return wrapper(<FlashSaleRenderer s={s} onUpdate={updateHandler} />);
    case 'testimonials': 
      return wrapper(<TestimonialsRenderer s={s} onUpdate={updateHandler} />);
    case 'rich-content': 
      return wrapper(<RichContentRenderer s={s} onUpdate={updateHandler} />);
    case 'newsletter': 
      return wrapper(<NewsletterRenderer s={s} onUpdate={updateHandler} />);
    case 'stats': 
      return wrapper(<StatsRenderer s={s} onUpdate={updateHandler} />);
    case 'video': 
      return wrapper(<VideoRenderer s={s} onUpdate={updateHandler} />);
    case 'custom-html': 
      return wrapper(<CustomHtmlRenderer s={s} />);
    default: 
      return null;
  }
}
