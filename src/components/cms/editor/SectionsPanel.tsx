import React, { useState, useRef, useEffect } from 'react';
import { useCms, ActiveElement } from './cms-store';
import { SectionType } from '@/lib/cms-types';
import { SectionForms } from './SectionForms';
import { LUXURY_PRESET_IMAGES } from './InlineWidgets';

export const AVAILABLE_BLOCKS: {
  id: SectionType;
  name: string;
  category: 'banners' | 'commerce' | 'content' | 'social';
  icon: string;
  desc: string;
  color: string;
}[] = [
  // Header & Banners
  { id: 'hero', name: 'Hero Banner', category: 'banners', icon: 'solar:gallery-wide-bold', desc: 'Main storefront hero with headline, search, and background.', color: '#3b82f6' },
  { id: 'promo-banner', name: 'Promo Banner', category: 'banners', icon: 'solar:tag-horizontal-bold', desc: 'Wide callout banner for sales and seasonal campaigns.', color: '#f59e0b' },
  { id: 'flash-sale', name: 'Flash Sale', category: 'banners', icon: 'solar:bolt-circle-bold', desc: 'Urgency-driven countdown banner with timer clock.', color: '#ef4444' },
  { id: 'stylist-banner', name: 'Stylist Showcase', category: 'banners', icon: 'solar:user-rounded-bold', desc: 'Personal stylist consultation call-to-action.', color: '#6366f1' },

  // Commerce & Products
  { id: 'featured-products', name: 'Product Grid', category: 'commerce', icon: 'solar:cart-large-bold', desc: 'Showcase trending, best-seller, or new arrival products.', color: '#10b981' },
  { id: 'category-grid', name: 'Category Tiles', category: 'commerce', icon: 'solar:map-bold', desc: 'Visual navigation tiles for store jewelry & apparel categories.', color: '#ec4899' },
  { id: 'brand-strip', name: 'Brand & Partner Strip', category: 'commerce', icon: 'solar:shield-star-bold', desc: 'Logos of verified craftspeople, brands, or certifications.', color: '#8b5cf6' },

  // Content & Storytelling
  { id: 'promo-cards', name: 'Guarantee Cards', category: 'content', icon: 'solar:widget-5-bold', desc: '4-column value proposition cards (warranty, sizing, shipping).', color: '#0ea5e9' },
  { id: 'rich-content', name: 'Rich Editorial', category: 'content', icon: 'solar:document-text-bold', desc: 'Editorial magazine layout with text, images, and stories.', color: '#64748b' },
  { id: 'seo-content', name: 'SEO & Care Guide', category: 'content', icon: 'solar:document-add-bold', desc: 'Structured FAQ, jewelry care advice, and keyword content.', color: '#475569' },
  { id: 'custom-html', name: 'Custom Code / HTML', category: 'content', icon: 'solar:code-square-bold', desc: 'Raw HTML and custom styles for specialized widgets.', color: '#1e293b' },

  // Social & Conversion
  { id: 'testimonials', name: 'Customer Testimonials', category: 'social', icon: 'solar:chat-round-like-bold', desc: 'Social proof cards with client ratings and feedback.', color: '#f97316' },
  { id: 'newsletter', name: 'Newsletter Signup', category: 'social', icon: 'solar:letter-bold', desc: 'High-conversion email capture box for VIP subscriber drops.', color: '#06b6d4' },
  { id: 'stats', name: 'Trust & Milestones', category: 'social', icon: 'solar:chart-square-bold', desc: 'Stat counter strip (e.g. 10k+ clients, 100% fair trade).', color: '#14b8a6' },
  { id: 'video', name: 'Video Showcase', category: 'social', icon: 'solar:video-frame-play-bold', desc: 'Embed YouTube or local MP4 atelier craftsmanship videos.', color: '#e11d48' },
];

// ─── Image Inspector Component ──────────────────────────────────────────────
function ImageInspector({
  element,
  section,
  onBack,
  onUpdate,
}: {
  element: Extract<ActiveElement, { type: 'image' }>;
  section: any;
  onBack: () => void;
  onUpdate: (url: string, alt?: string) => void;
}) {
  const [url, setUrl] = useState(element.url || '');
  const [alt, setAlt] = useState(element.alt || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(element.url || '');
    setAlt(element.alt || '');
  }, [element]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setUrl(data.url);
        onUpdate(data.url, alt);
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleApplyPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    onUpdate(presetUrl, alt);
  };

  const handleChangeUrl = (newUrl: string) => {
    setUrl(newUrl);
    onUpdate(newUrl, alt);
  };

  return (
    <div style={{ padding: '16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#ff6c2f', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <span>←</span> Back to Section
        </button>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Image Inspector</span>
      </div>

      {/* Image Preview Box */}
      <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#0f172a', maxHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {url ? (
          <img src={url} alt={alt || 'Preview'} style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }} />
        ) : (
          <div style={{ padding: '32px', color: '#64748b', fontSize: '12px' }}>No image set</div>
        )}
      </div>

      {/* File Upload Button */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px dashed #3b82f6',
            background: '#eff6ff',
            color: '#1d4ed8',
            fontSize: '12px',
            fontWeight: 600,
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>{uploading ? '⏳ Uploading...' : '📁 Upload From Computer'}</span>
        </button>
      </div>

      {/* Image URL Input */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
          Or Image URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => handleChangeUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            outline: 'none',
          }}
        />
      </div>

      {/* Luxury Curated Presets */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
          Luxury Curated Presets
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {LUXURY_PRESET_IMAGES.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p.url)}
              style={{
                padding: 0,
                border: url === p.url ? '2px solid #ff6c2f' : '1px solid #e2e8f0',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '1/1',
                cursor: 'pointer',
                background: '#f8fafc',
              }}
              title={p.name}
            >
              <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '2px',
                  opacity: url === p.url ? 1 : 0,
                  transition: 'opacity 0.15s',
                }}
              >
                {p.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Alt Text */}
      <div>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
          Alt Text / Description (SEO)
        </label>
        <input
          type="text"
          value={alt}
          onChange={(e) => {
            setAlt(e.target.value);
            onUpdate(url, e.target.value);
          }}
          placeholder="e.g. Handcrafted Gemstone Ring"
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            outline: 'none',
          }}
        />
      </div>
    </div>
  );
}

// ─── Button Inspector Component ─────────────────────────────────────────────
function ButtonInspector({
  element,
  section,
  onBack,
  onUpdate,
}: {
  element: Extract<ActiveElement, { type: 'button' }>;
  section: any;
  onBack: () => void;
  onUpdate: (patch: { label?: string; link?: string; style?: 'filled' | 'outline'; color?: string }) => void;
}) {
  const [label, setLabel] = useState(element.label || 'Button');
  const [link, setLink] = useState(element.link || '#');
  const [styleVariant, setStyleVariant] = useState<'filled' | 'outline'>((element.styleVariant as any) || 'filled');
  const [color, setColor] = useState(element.color || '#ff6c2f');

  useEffect(() => {
    setLabel(element.label || 'Button');
    setLink(element.link || '#');
    setStyleVariant((element.styleVariant as any) || 'filled');
    setColor(element.color || '#ff6c2f');
  }, [element]);

  const quickLinks = [
    { label: '🏠 Homepage', url: '/' },
    { label: '🛍 All Products', url: '/products' },
    { label: '💍 Fine Jewelry', url: '/products?category=jewelry' },
    { label: '🧶 Cashmere', url: '/products?category=knitwear' },
    { label: '📖 About Us', url: '/about' },
    { label: '💎 Care Guide', url: '/care-guide' },
    { label: '📸 Lookbook', url: '/lookbook' },
    { label: '👑 VIP Membership', url: '/membership' },
    { label: '🛒 Cart', url: '/cart' },
  ];

  const luxuryPalette = [
    { name: 'Waveron Bronze', hex: '#8B5A3C' },
    { name: 'Warm Gold', hex: '#D4A574' },
    { name: 'Deep Charcoal', hex: '#1E293B' },
    { name: 'Espresso', hex: '#3D2817' },
    { name: 'Signature Orange', hex: '#FF6C2F' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Pure White', hex: '#FFFFFF' },
  ];

  return (
    <div style={{ padding: '16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#ff6c2f', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <span>←</span> Back to Section
        </button>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Button Inspector</span>
      </div>

      {/* Button Preview */}
      <div style={{ marginBottom: '16px', padding: '24px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '13px',
            backgroundColor: styleVariant === 'filled' ? color : 'transparent',
            border: `2px solid ${color}`,
            color: styleVariant === 'filled' ? (color === '#FFFFFF' ? '#000' : '#fff') : color,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {label || 'Button Preview'}
        </div>
      </div>

      {/* Button Label Text */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
          Button Text
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            onUpdate({ label: e.target.value });
          }}
          placeholder="e.g. Explore Collection"
          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
        />
      </div>

      {/* Button Destination Link */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
          Destination URL
        </label>
        <input
          type="text"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            onUpdate({ link: e.target.value });
          }}
          placeholder="/products"
          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', marginBottom: '8px' }}
        />
        {/* Quick Link Chips */}
        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Quick Page Shortcuts:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {quickLinks.map((q) => (
            <button
              key={q.url}
              type="button"
              onClick={() => {
                setLink(q.url);
                onUpdate({ link: q.url });
              }}
              style={{
                padding: '3px 8px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: link === q.url ? '#0f172a' : '#fff',
                color: link === q.url ? '#fff' : '#475569',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Button Style Variant */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
          Button Style
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['filled', 'outline'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setStyleVariant(v);
                onUpdate({ style: v });
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: styleVariant === v ? '#0f172a' : '#fff',
                color: styleVariant === v ? '#fff' : '#475569',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Button Color */}
      <div>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
          Button Color
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <input
            type="color"
            value={color.startsWith('#') ? color : '#ff6c2f'}
            onChange={(e) => {
              setColor(e.target.value);
              onUpdate({ color: e.target.value });
            }}
            style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '2px' }}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              onUpdate({ color: e.target.value });
            }}
            style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          />
        </div>
        {/* Luxury Swatches */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {luxuryPalette.map((p) => (
            <button
              key={p.hex}
              type="button"
              onClick={() => {
                setColor(p.hex);
                onUpdate({ color: p.hex });
              }}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: p.hex,
                border: '1px solid rgba(0,0,0,0.2)',
                cursor: 'pointer',
                outline: color.toLowerCase() === p.hex.toLowerCase() ? '2px solid #ff6c2f' : 'none',
                outlineOffset: '2px',
              }}
              title={p.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SectionsPanel({ insertAtIndex }: { insertAtIndex?: number | null }) {
  const {
    sections,
    activeId,
    activeElement,
    activeTab,
    setActive,
    setActiveElement,
    setActiveTab,
    addSection,
    insertSectionAt,
    removeSection,
    moveSection,
    duplicateSection,
    updateSection,
  } = useCms();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeSection = sections.find((s) => s.id === activeId);
  const activeIndex = sections.findIndex((s) => s.id === activeId);

  const filteredBlocks = AVAILABLE_BLOCKS.filter((block) => {
    const matchesCat = selectedCategory === 'all' || block.category === selectedCategory;
    const matchesQuery = block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleInsertBlock = (type: SectionType) => {
    if (typeof insertAtIndex === 'number') {
      insertSectionAt(type, insertAtIndex);
    } else if (activeIndex !== -1) {
      insertSectionAt(type, activeIndex + 1);
    } else {
      addSection(type);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* ── Top Tabs (Odoo style: Blocks vs Customize) ── */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          padding: '4px',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('blocks')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: activeTab === 'blocks' ? '#fff' : 'transparent',
            color: activeTab === 'blocks' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'blocks' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span>🧱</span> Blocks
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('customize')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: activeTab === 'customize' ? '#fff' : 'transparent',
            color: activeTab === 'customize' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'customize' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span>🎨</span> Customize
          {activeSection && (
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#ff6c2f',
                display: 'inline-block',
              }}
            />
          )}
        </button>
      </div>

      {/* ── TAB 1: BLOCKS (Snippets Drawer) ── */}
      {activeTab === 'blocks' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Search & Category Filter */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blocks (hero, products...)"
                style={{
                  width: '100%',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'banners', label: 'Banners' },
                { id: 'commerce', label: 'Store' },
                { id: 'content', label: 'Content' },
                { id: 'social', label: 'Social' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    background: selectedCategory === c.id ? '#0f172a' : '#f1f5f9',
                    color: selectedCategory === c.id ? '#fff' : '#64748b',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Block Cards List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredBlocks.map((block) => (
              <div
                key={block.id}
                onClick={() => handleInsertBlock(block.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = block.color;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: `${block.color}15`,
                    color: block.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <iconify-icon icon={block.icon} style={{ fontSize: '20px' }}></iconify-icon>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{block.name}</span>
                    <span style={{ fontSize: '11px', color: '#ff6c2f', fontWeight: 600 }}>+ Add</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: '1.3' }}>
                    {block.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: CUSTOMIZE (Inspector) ── */}
      {activeTab === 'customize' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeSection ? (
            activeElement?.type === 'image' && activeElement.sectionId === activeSection.id ? (
              <ImageInspector
                element={activeElement}
                section={activeSection}
                onBack={() => setActiveElement({ type: 'section', sectionId: activeSection.id })}
                onUpdate={(newUrl, newAlt) => {
                  updateSection(activeSection.id, {
                    [activeElement.field]: newUrl,
                    ...(newAlt !== undefined ? { alt: newAlt } : {}),
                  } as any);
                }}
              />
            ) : activeElement?.type === 'button' && activeElement.sectionId === activeSection.id ? (
              <ButtonInspector
                element={activeElement}
                section={activeSection}
                onBack={() => setActiveElement({ type: 'section', sectionId: activeSection.id })}
                onUpdate={(patch) => {
                  const updates: any = {};
                  if (patch.label !== undefined) updates[activeElement.labelField] = patch.label;
                  if (patch.link !== undefined) updates[activeElement.linkField] = patch.link;
                  if (patch.color !== undefined && activeElement.colorField) updates[activeElement.colorField] = patch.color;
                  if (patch.style !== undefined && activeElement.styleField) updates[activeElement.styleField] = patch.style;
                  updateSection(activeSection.id, updates);
                }}
              />
            ) : (
              <>
                {/* Section Header & Floating Action Icons */}
                <div
                  style={{
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
                      Active Section
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', textTransform: 'capitalize' }}>
                      {activeSection.type.replace('-', ' ')}
                    </div>
                  </div>

                  {/* Section Action Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => moveSection(activeSection.id, 'up')}
                      disabled={activeIndex === 0}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: '#fff',
                        cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                        opacity: activeIndex === 0 ? 0.3 : 1,
                        fontSize: '11px',
                      }}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(activeSection.id, 'down')}
                      disabled={activeIndex === sections.length - 1}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: '#fff',
                        cursor: activeIndex === sections.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: activeIndex === sections.length - 1 ? 0.3 : 1,
                        fontSize: '11px',
                      }}
                      title="Move Down"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateSection(activeSection.id)}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                      title="Duplicate Section"
                    >
                      ⧉
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSection(activeSection.id, { visible: !activeSection.visible })}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: activeSection.visible ? '#fff' : '#fee2e2',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                      title={activeSection.visible ? 'Hide Section' : 'Show Section'}
                    >
                      {activeSection.visible ? '👁' : '🚫'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(activeSection.id)}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: '1px solid #fecaca',
                        background: '#fff',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                      title="Delete Section"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {/* Scrollable Form Settings */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                  {/* Visual Spacing & Padding Controls */}
                  <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Layout Spacing
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Padding Top ({activeSection.paddingTop || 0}px)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="160"
                          step="8"
                          value={activeSection.paddingTop || 0}
                          onChange={(e) => updateSection(activeSection.id, { paddingTop: Number(e.target.value) })}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Padding Bottom ({activeSection.paddingBottom || 0}px)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="160"
                          step="8"
                          value={activeSection.paddingBottom || 0}
                          onChange={(e) => updateSection(activeSection.id, { paddingBottom: Number(e.target.value) })}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                  <SectionForms section={activeSection} />
                </div>
              </>
            )
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '22px' }}>
                👆
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                No Block Selected
              </div>
              <p style={{ fontSize: '12px', lineHeight: '1.5', maxWidth: '220px', marginBottom: '16px' }}>
                Click on any section, image, or button on the canvas to customize its typography, imagery, and styling in this inspector.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('blocks')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Add New Block
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
