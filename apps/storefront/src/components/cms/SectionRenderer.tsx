import { CmsSection } from '../../lib/cms-types';
import { Hero } from '../Hero';
import { PromoCards } from '../PromoCards';
import { PromoBanner } from '../PromoBanner';
import { StylistBanner } from '../StylistBanner';
import { SeoContent } from '../SeoContent';
import { ProductGrid } from '../ProductGrid';
import { CategoryGrid } from '../CategoryGrid';
import { BrandStrip } from '../BrandStrip';

export function HeroRenderer({ s }: { s: any }) {
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
        <h1
          className="font-bold mb-4 leading-tight"
          style={{ fontSize: `${s.headingSize}px`, color: s.textColor, textAlign: s.textAlign }}
        >
          {s.heading || 'Hero Heading'}
        </h1>
        {s.subheading && (
          <p className="text-lg mb-8 opacity-90" style={{ color: s.textColor, textAlign: s.textAlign }}>
            {s.subheading}
          </p>
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
            >
              {s.cta1Label}
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
            >
              {s.cta2Label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function FeaturedProductsRenderer({ s }: { s: any }) {
  const cols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5' }[s.columns as number] || 'grid-cols-4';
  const mockProducts = Array.from({ length: Math.min(s.maxProducts, 8) }, (_, i) => i);
  return (
    <div style={{ backgroundColor: s.backgroundColor, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6">
        {s.title && <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">{s.title}</h2>}
        {s.subtitle && <p className="text-center text-gray-500 mb-8">{s.subtitle}</p>}
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
            <a href={s.viewAllLink || '#'} className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium">{s.viewAllLabel}</a>
          </div>
        )}
      </div>
    </div>
  );
}

export function CategoryGridRenderer({ s }: { s: any }) {
  const cols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 6: 'grid-cols-6' }[s.columns as number] || 'grid-cols-4';
  const mockCats = ['Fashion', 'Electronics', 'Home', 'Sports', 'Beauty', 'Books'];
  return (
    <div style={{ paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6">
        {s.title && <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">{s.title}</h2>}
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

export function FlashSaleRenderer({ s }: { s: any }) {
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
        {s.bannerLabel && <span className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: s.textColor }}>{s.bannerLabel}</span>}
        {s.title && <h2 className="text-4xl font-bold mb-6" style={{ color: s.textColor }}>{s.title}</h2>}
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

export function StatsRenderer({ s }: { s: any }) {
  return (
    <div style={{ backgroundColor: s.backgroundColor, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-wrap justify-center gap-8 ${s.layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-4' : ''}`}>
          {s.items.map((item: any) => (
            <div key={item.id} className="text-center flex-1 min-w-[120px]">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-xl font-bold text-gray-900">{item.number}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NewsletterRenderer({ s }: { s: any }) {
  const bg: React.CSSProperties = s.backgroundType === 'gradient'
    ? { background: `linear-gradient(135deg, ${s.backgroundColor}, ${s.backgroundColor}cc)` }
    : s.backgroundType === 'image' && s.backgroundImage
    ? { backgroundImage: `url(${s.backgroundImage})`, backgroundSize: 'cover' }
    : { backgroundColor: s.backgroundColor };
  return (
    <div style={{ ...bg, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">{s.heading}</h2>
        {s.subtext && <p className="text-white/80 mb-6">{s.subtext}</p>}
        <div className="flex gap-2 max-w-md mx-auto">
          <input placeholder={s.placeholder} className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none" />
          <button className="px-6 py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: s.buttonColor }}>{s.buttonLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsRenderer({ s }: { s: any }) {
  return (
    <div style={{ backgroundColor: s.backgroundColor, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6">
        {s.title && <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">{s.title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {s.items.map((item: any) => (
            <div key={item.id} className={`p-6 rounded-xl ${s.cardStyle === 'shadowed' ? 'shadow-lg' : s.cardStyle === 'bordered' ? 'border-2 border-gray-200' : ''} bg-white`}>
              <div className="flex mb-3">{'⭐'.repeat(item.rating)}</div>
              <p className="text-gray-700 mb-4 italic">"{item.text}"</p>
              <div className="font-semibold text-gray-900">{item.name}</div>
              {item.company && <div className="text-sm text-gray-500">{item.company}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VideoRenderer({ s }: { s: any }) {
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
              <p className="text-white text-2xl font-bold">{s.overlayText}</p>
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

export function BrandStripRenderer({ s }: { s: any }) {
  return (
    <div style={{ paddingTop: s.paddingTop, paddingBottom: s.paddingBottom, backgroundColor: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto px-6">
        {s.title && <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">{s.title}</h2>}
        <div className="flex gap-8 items-center justify-center flex-wrap">
          {s.brands.length === 0
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

export function RichContentRenderer({ s }: { s: any }) {
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
            <a href={s.ctaLink || '#'} className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-medium">{s.ctaLabel}</a>
          </div>
        )}
      </div>
    </div>
  );
}

export function renderSection(s: CmsSection, activeId?: string, onClick?: (id: string) => void) {
  if (!s.visible) return null;
  const isActive = s.id === activeId;
  const wrapperProps: React.HTMLAttributes<HTMLDivElement> = {
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

  const wrapper = (children: React.ReactNode) => (
    <div key={s.id} {...wrapperProps}>
      {isActive && onClick && (
        <div className="absolute top-2 left-2 z-50 bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium pointer-events-none">
          {s.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </div>
      )}
      {children}
    </div>
  );
  
  switch (s.type) {
    case 'hero': return wrapper(<Hero />);
    case 'promo-cards': return wrapper(<PromoCards />);
    case 'category-grid': return wrapper(<CategoryGrid />);
    case 'featured-products': return wrapper(<ProductGrid title={(s as any).title || "Featured"} limit={(s as any).maxProducts || 8} />);
    case 'promo-banner': return wrapper(<PromoBanner />);
    case 'brand-strip': return wrapper(<BrandStrip />);
    case 'stylist-banner': return wrapper(<StylistBanner />);
    case 'seo-content': return wrapper(<SeoContent />);
    
    case 'flash-sale': return wrapper(<FlashSaleRenderer s={s} />);
    case 'testimonials': return wrapper(<TestimonialsRenderer s={s} />);
    case 'rich-content': return wrapper(<RichContentRenderer s={s} />);
    case 'newsletter': return wrapper(<NewsletterRenderer s={s} />);
    case 'stats': return wrapper(<StatsRenderer s={s} />);
    case 'video': return wrapper(<VideoRenderer s={s} />);
    case 'custom-html': return wrapper(<CustomHtmlRenderer s={s} />);
    default: return null;
  }
}
