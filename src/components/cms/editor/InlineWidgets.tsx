'use client';

import React, { useState, useEffect, useRef } from 'react';

// ─── Multi-Industry Curated Preset Images ────────────────────────────────────
export const INDUSTRY_PRESET_IMAGES: Record<string, { label: string; icon: string; images: { name: string; url: string }[] }> = {
  hardware: {
    label: 'Hardware & Tools',
    icon: '🔨',
    images: [
      { name: 'Power Drill & Tools', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Tool Workshop', url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Construction Gear', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Hardware Fasteners', url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Hand Tools Bench', url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Industrial Supplies', url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1200&q=80' },
    ],
  },
  electronics: {
    label: 'Electronics & Tech',
    icon: '💻',
    images: [
      { name: 'Modern Laptop Desk', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Hi-Fi Audio Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Flagship Smartphone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Smartwatch & Tech', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Gaming Rig & Setup', url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Studio Speakers', url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80' },
    ],
  },
  fashion: {
    label: 'Fashion & Apparel',
    icon: '👗',
    images: [
      { name: 'Designer Lookbook', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Warm Knitwear', url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Minimalist Wardrobe', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Urban Streetwear', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Premium Leather', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Sport Footwear', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80' },
    ],
  },
  grocery: {
    label: 'Supermarket & Food',
    icon: '🛒',
    images: [
      { name: 'Farm Fresh Produce', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Organic Fruits & Veg', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Artisan Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Specialty Coffee', url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Gourmet Pantry', url: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Cold Pressed Juices', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80' },
    ],
  },
  general: {
    label: 'Retail & Store',
    icon: '🏬',
    images: [
      { name: 'Home Living & Decor', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Kitchen Essentials', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Travel & Luggage', url: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Cosmetics & Skincare', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Office & Stationery', url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Modern Storefront', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80' },
    ],
  },
  jewelry: {
    label: 'Jewelry & Gems',
    icon: '💎',
    images: [
      { name: 'Fine Gold Ring', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Diamond Solitaire', url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Gemstone Pendant', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Luxury Timepiece', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Pearl Necklace', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Atelier Workshop', url: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1200&q=80' },
    ],
  },
};

export const LUXURY_PRESET_IMAGES = INDUSTRY_PRESET_IMAGES.jewelry.images;

// ─── InlineText with Floating Formatting Toolbar ────────────────────────────
export function InlineText({
  value,
  onUpdate,
  className,
  style,
  tagName = 'span',
  placeholder = 'Type here...',
  multiline = false,
}: {
  value: string;
  onUpdate?: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'a';
  placeholder?: string;
  multiline?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value || '');
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setCurrentVal(value || '');
  }, [value]);

  if (!onUpdate) {
    const Tag = tagName;
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  const handleFocus = () => {
    setIsEditing(true);
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setToolbarPos({
        top: Math.max(10, rect.top - 44),
        left: Math.max(10, rect.left),
      });
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setToolbarPos(null);
    if (currentVal !== value) {
      onUpdate(currentVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      elementRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setCurrentVal(value || '');
      setIsEditing(false);
      setToolbarPos(null);
      elementRef.current?.blur();
    }
  };

  const applyFormatting = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (elementRef.current) {
      setCurrentVal(elementRef.current.innerHTML);
    }
  };

  const Tag = tagName;

  return (
    <>
      {/* Floating Toolbar when editing */}
      {isEditing && toolbarPos && (
        <div
          style={{
            position: 'fixed',
            top: `${toolbarPos.top}px`,
            left: `${toolbarPos.left}px`,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#0f172a',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            border: '1px solid #334155',
            fontSize: '12px',
          }}
          onMouseDown={e => e.preventDefault()} // prevent blur
        >
          <button
            type="button"
            onClick={() => applyFormatting('bold')}
            style={{ padding: '3px 7px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('italic')}
            style={{ padding: '3px 7px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontStyle: 'italic' }}
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('underline')}
            style={{ padding: '3px 7px', background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', textDecoration: 'underline' }}
            title="Underline"
          >
            U
          </button>

          <div style={{ width: '1px', height: '14px', background: '#334155', margin: '0 2px' }} />

          {/* Quick Color swatches */}
          {['#ffffff', '#0f172a', '#ff6c2f', '#d97706', '#059669', '#3b82f6'].map(c => (
            <button
              key={c}
              type="button"
              onClick={() => applyFormatting('foreColor', c)}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: c,
                border: '1px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: 0,
              }}
              title={c}
            />
          ))}

          <div style={{ width: '1px', height: '14px', background: '#334155', margin: '0 2px' }} />

          <button
            type="button"
            onClick={() => elementRef.current?.blur()}
            style={{ padding: '2px 8px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '11px' }}
          >
            Done
          </button>
        </div>
      )}

      <Tag
        ref={elementRef as any}
        contentEditable
        suppressContentEditableWarning
        onClick={(e) => {
          e.stopPropagation();
          handleFocus();
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={(e) => setCurrentVal(e.currentTarget.textContent || '')}
        className={`${className || ''} transition-all duration-150 ${
          isEditing
            ? 'outline-none ring-2 ring-[#ff6c2f] rounded px-1 bg-white/20'
            : 'hover:ring-1 hover:ring-[#ff6c2f]/70 hover:ring-dashed rounded cursor-text'
        }`}
        style={{
          ...style,
          cursor: 'text',
        }}
        title="Click to edit text"
      >
        {currentVal || placeholder}
      </Tag>
    </>
  );
}

// ─── InlineImage with Click-to-Inspect in Sidebar ───────────────────────────
export function InlineImage({
  src,
  alt = 'Image',
  sectionId,
  field = 'backgroundImage',
  onUpdate,
  onSelect,
  className,
  style,
  aspectRatio = 'square',
}: {
  src: string;
  alt?: string;
  sectionId?: string;
  field?: string;
  onUpdate?: (patch: { src: string; alt?: string }) => void;
  onSelect?: (el: any) => void;
  className?: string;
  style?: React.CSSProperties;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
}) {
  const [imgSrc, setImgSrc] = useState(src || '');
  const [imgAlt, setImgAlt] = useState(alt || '');

  useEffect(() => {
    setImgSrc(src || '');
  }, [src]);

  if (!onUpdate && !onSelect) {
    return <img src={src} alt={alt} className={className} style={style} />;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const payload = {
      type: 'image',
      sectionId: sectionId || '',
      field,
      url: imgSrc,
      alt: imgAlt,
      label: alt || 'Image',
    };
    if (onSelect) {
      onSelect(payload);
    }
    if (typeof window !== 'undefined') {
      window.parent?.postMessage({ type: 'ELEMENT_SELECTED', element: payload }, '*');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative group inline-block w-full h-full cursor-pointer transition-all duration-150"
      style={style}
      title="Click to edit image in inspector"
    >
      <img
        src={imgSrc || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'}
        alt={imgAlt}
        className={`${className || ''} transition-all duration-200 group-hover:brightness-90 group-hover:ring-2 group-hover:ring-[#ff6c2f] group-hover:ring-offset-2 rounded-lg`}
      />

      {/* Edit Badge Overlay on Hover */}
      <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1.5 backdrop-blur-sm border border-slate-700 pointer-events-none">
        <span>📷</span>
        <span>Edit in Inspector</span>
      </div>
    </div>
  );
}

// ─── InlineButton with Click-to-Inspect in Sidebar ──────────────────────────
export function InlineButton({
  label,
  link = '#',
  styleVariant = 'filled',
  color = '#ff6c2f',
  sectionId,
  labelField = 'ctaLabel',
  linkField = 'ctaLink',
  colorField = 'ctaColor',
  styleField = 'ctaStyle',
  onUpdate,
  onSelect,
  className,
  style,
}: {
  label: string;
  link?: string;
  styleVariant?: 'filled' | 'outline';
  color?: string;
  sectionId?: string;
  labelField?: string;
  linkField?: string;
  colorField?: string;
  styleField?: string;
  onUpdate?: (patch: { label?: string; link?: string; style?: 'filled' | 'outline'; color?: string }) => void;
  onSelect?: (el: any) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [btnLabel, setBtnLabel] = useState(label || 'Button');
  const [btnLink, setBtnLink] = useState(link || '#');
  const [btnStyle, setBtnStyle] = useState<'filled' | 'outline'>(styleVariant || 'filled');
  const [btnColor, setBtnColor] = useState(color || '#ff6c2f');

  useEffect(() => {
    setBtnLabel(label || 'Button');
    setBtnLink(link || '#');
    setBtnStyle(styleVariant || 'filled');
    setBtnColor(color || '#ff6c2f');
  }, [label, link, styleVariant, color]);

  if (!onUpdate && !onSelect) {
    return (
      <a
        href={link}
        className={className}
        style={{
          ...style,
          backgroundColor: styleVariant === 'filled' ? color : 'transparent',
          borderColor: color,
          color: styleVariant === 'filled' ? '#fff' : color,
        }}
      >
        {label}
      </a>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = {
      type: 'button',
      sectionId: sectionId || '',
      labelField,
      linkField,
      colorField,
      styleField,
      label: btnLabel,
      link: btnLink,
      color: btnColor,
      styleVariant: btnStyle,
    };
    if (onSelect) {
      onSelect(payload);
    }
    if (typeof window !== 'undefined') {
      window.parent?.postMessage({ type: 'ELEMENT_SELECTED', element: payload }, '*');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${className || ''} relative group/btn cursor-pointer transition-all border-2 hover:ring-2 hover:ring-[#ff6c2f] hover:ring-offset-2`}
      style={{
        ...style,
        backgroundColor: btnStyle === 'filled' ? btnColor : 'transparent',
        borderColor: btnColor,
        color: btnStyle === 'filled' ? '#fff' : btnColor,
      }}
      title="Click to configure button in inspector"
    >
      <span>{btnLabel}</span>
      <span className="ml-1 opacity-70 text-[10px]">⚙</span>
    </button>
  );
}

