"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CmsSection } from '../../lib/cms-types';
import { Hero } from '../Hero';
import { PromoCards } from '../PromoCards';
import { PromoBanner } from '../PromoBanner';
import { StylistBanner } from '../StylistBanner';
import { SeoContent } from '../SeoContent';
import { ProductGrid } from '../ProductGrid';
import { CategoryGrid } from '../CategoryGrid';
import { BrandStrip } from '../BrandStrip';

// ─── InlineText Component for Direct Editing ─────────────────────────────────
export function InlineText({
  value,
  onUpdate,
  className,
  style,
  tagName = 'span',
}: {
  value: string;
  onUpdate?: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tagName?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'a';
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setCurrentVal(value);
  }, [value]);

  // If there is no onUpdate, it's read-only
  if (!onUpdate) {
    const Tag = tagName;
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  const handleBlur = () => {
    setIsEditing(false);
    if (currentVal !== value) {
      onUpdate(currentVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      elementRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setCurrentVal(value);
      setIsEditing(false);
    }
  };

  const Tag = tagName;

  return (
    <Tag
      ref={elementRef as any}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onDoubleClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsEditing(true);
        setTimeout(() => {
          if (elementRef.current) {
            elementRef.current.focus();
            const range = document.createRange();
            range.selectNodeContents(elementRef.current);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 50);
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onInput={(e) => setCurrentVal(e.currentTarget.textContent || '')}
      className={`${className || ''} transition-all duration-150 ${
        isEditing 
          ? 'outline-none ring-2 ring-orange-500 rounded px-1 bg-white/20 text-orange-950 dark:text-orange-100' 
          : 'hover:ring-1 hover:ring-orange-400 hover:ring-dashed rounded cursor-pointer'
      }`}
      style={{
        ...style,
        outline: 'none',
        cursor: isEditing ? 'text' : 'pointer',
      }}
      title={isEditing ? 'Press Enter to save, Esc to cancel' : 'Double-click to edit text'}
    >
      {currentVal}
    </Tag>
  );
}

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
            <a
              href={s.cta1Link || '#'}
              className="inline-block px-8 py-3 rounded-lg font-semibold mr-3 border-2 transition-all"
              style={{
                backgroundColor: s.cta1Style === 'filled' ? s.cta1Color : 'transparent',
                borderColor: s.cta1Color,
                color: s.cta1Style === 'filled' ? '#fff' : s.cta1Color,
              }}
              onClick={e => { if (onUpdate) e.preventDefault(); }}
            >
              <InlineText
                value={s.cta1Label}
                onUpdate={onUpdate ? (val) => onUpdate({ cta1Label: val }) : undefined}
              />
            </a>
          )}
          {s.cta2Label && (
            <a
              href={s.cta2Link || '#'}
              className="inline-block px-8 py-3 rounded-lg font-semibold border-2 transition-all"
              style={{
                backgroundColor: s.cta2Style === 'filled' ? s.cta2Color : 'transparent',
                borderColor: s.cta2Color,
                color: s.cta2Style === 'filled' ? '#fff' : s.cta2Color,
              }}
              onClick={e => { if (onUpdate) e.preventDefault(); }}
            >
              <InlineText
                value={s.cta2Label}
                onUpdate={onUpdate ? (val) => onUpdate({ cta2Label: val }) : undefined}
              />
            </a>
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
      outline: isActive ? '3px solid #3b82f6' : '3px solid transparent',
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
        <div className="absolute top-2 left-2 z-50 bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium pointer-events-none">
          {s.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </div>
      )}
      {children}
    </div>
  );
  
  const updateHandler = onUpdateSection ? (patch: any) => onUpdateSection(s.id, patch) : undefined;

  switch (s.type) {
    case 'hero': 
      return wrapper(
        <Hero 
          heading={(s as any).heading} 
          searchPlaceholder={(s as any).subheading}
          backgroundColor={(s as any).backgroundColor}
          backgroundImage={(s as any).backgroundImage}
        />
      );
    case 'promo-cards': 
      return wrapper(
        <PromoCards 
          card1Title={(s as any).card1Title}
          card1Subtitle={(s as any).card1Subtitle}
          card1Link={(s as any).card1Link}
          card1Badge={(s as any).card1Badge}
          card1Bg={(s as any).card1Bg}
          card2Title={(s as any).card2Title}
          card2Subtitle={(s as any).card2Subtitle}
          card2Link={(s as any).card2Link}
          card2Badge={(s as any).card2Badge}
          card2Bg={(s as any).card2Bg}
          card3Title={(s as any).card3Title}
          card3Subtitle={(s as any).card3Subtitle}
          card3Link={(s as any).card3Link}
          card3Badge={(s as any).card3Badge}
          card3Bg={(s as any).card3Bg}
          card4Title={(s as any).card4Title}
          card4Subtitle={(s as any).card4Subtitle}
          card4Link={(s as any).card4Link}
          card4Badge={(s as any).card4Badge}
          card4Bg={(s as any).card4Bg}
        />
      );
    case 'category-grid': 
      return wrapper(
        <CategoryGrid 
          title={(s as any).title} 
          cat1Label={(s as any).cat1Label}
          cat2Label={(s as any).cat2Label}
          cat3Label={(s as any).cat3Label}
          cat4Label={(s as any).cat4Label}
          cat5Label={(s as any).cat5Label}
          cat6Label={(s as any).cat6Label}
          cat7Label={(s as any).cat7Label}
          cat8Label={(s as any).cat8Label}
          cat9Label={(s as any).cat9Label}
          cat10Label={(s as any).cat10Label}
        />
      );
    case 'featured-products': 
      return wrapper(
        <ProductGrid 
          title={(s as any).title || "Featured"} 
          limit={(s as any).maxProducts || 8}
          columns={(s as any).columns}
          showPrice={(s as any).showPrice}
          showRating={(s as any).showRating}
          showAddToCart={(s as any).showAddToCart}
          showDiscountBadge={(s as any).showDiscountBadge}
          backgroundColor={(s as any).backgroundColor}
        />
      );
    case 'promo-banner': 
      return wrapper(
        <PromoBanner 
          title={(s as any).title}
          description={(s as any).description}
          ctaLabel={(s as any).ctaLabel}
          ctaLink={(s as any).ctaLink}
        />
      );
    case 'brand-strip': 
      return wrapper(<BrandStrip title={(s as any).title} brands={(s as any).brands} />);
    case 'stylist-banner': 
      return wrapper(
        <StylistBanner 
          title={(s as any).title} 
          description={(s as any).description} 
          ctaLabel={(s as any).ctaLabel} 
        />
      );
    case 'seo-content': 
      return wrapper(
        <SeoContent 
          title1={(s as any).title1} 
          body1={(s as any).body1}
          title2={(s as any).title2}
          body2={(s as any).body2}
          title3={(s as any).title3}
          body3={(s as any).body3}
        />
      );
    
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
