'use client';

import React, { useState, useEffect, useRef } from 'react';

// ─── Preset Images for Luxury Store ──────────────────────────────────────────
export const LUXURY_PRESET_IMAGES = [
  {
    name: 'Fine Gold Ring',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Diamond Solitaire',
    url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cashmere Knitwear',
    url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Atelier Workshop',
    url: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Editorial Lookbook',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Minimalist Silk',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
  },
];

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

// ─── InlineImage with Click-to-Replace & Uploader ───────────────────────────
export function InlineImage({
  src,
  alt = 'Image',
  onUpdate,
  className,
  style,
  aspectRatio = 'square',
}: {
  src: string;
  alt?: string;
  onUpdate?: (patch: { src: string; alt?: string }) => void;
  className?: string;
  style?: React.CSSProperties;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(src || '');
  const [imgAlt, setImgAlt] = useState(alt || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImgSrc(src || '');
  }, [src]);

  if (!onUpdate) {
    return <img src={src} alt={alt} className={className} style={style} />;
  }

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
        setImgSrc(data.url);
        onUpdate({ src: data.url, alt: imgAlt });
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleApply = (urlToApply = imgSrc) => {
    onUpdate({ src: urlToApply, alt: imgAlt });
    setIsOpen(false);
  };

  return (
    <div className="relative group inline-block w-full h-full" style={style}>
      <img
        src={imgSrc || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'}
        alt={imgAlt}
        className={`${className || ''} transition-all duration-200 group-hover:brightness-95`}
      />

      {/* Edit Badge Overlay */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 hover:bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 backdrop-blur-sm border border-slate-700 cursor-pointer"
        title="Click to replace image"
      >
        <span>📷</span>
        <span className="font-medium text-[11px]">Change Image</span>
      </button>

      {/* Image Picker Popover */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 top-12 right-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 text-slate-800 text-left font-sans text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span>🖼</span> Replace Image
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>

          {/* Upload Button */}
          <div className="mb-3">
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
              className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold flex items-center justify-center gap-2 border border-blue-200 transition-colors cursor-pointer"
            >
              <span>{uploading ? '⏳ Uploading...' : '📁 Upload From Computer'}</span>
            </button>
          </div>

          {/* Image URL Input */}
          <div className="mb-3">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Or Paste Image URL</label>
            <input
              type="url"
              value={imgSrc}
              onChange={(e) => setImgSrc(e.target.value)}
              placeholder="https://..."
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500"
            />
          </div>

          {/* Luxury Curated Presets */}
          <div className="mb-3">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1.5">Luxury Presets</label>
            <div className="grid grid-cols-3 gap-1.5">
              {LUXURY_PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setImgSrc(preset.url);
                    handleApply(preset.url);
                  }}
                  className="group/item relative rounded overflow-hidden aspect-square border border-slate-200 hover:border-blue-500 transition-all p-0"
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 flex items-center justify-center text-[9px] text-white font-medium p-1 text-center">
                    {preset.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleApply()}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── InlineButton with CTA Link & Style Popover ─────────────────────────────
export function InlineButton({
  label,
  link = '#',
  styleVariant = 'filled',
  color = '#ff6c2f',
  onUpdate,
  className,
  style,
}: {
  label: string;
  link?: string;
  styleVariant?: 'filled' | 'outline';
  color?: string;
  onUpdate?: (patch: { label?: string; link?: string; style?: 'filled' | 'outline'; color?: string }) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [isOpen, setIsOpen] = useState(false);
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

  if (!onUpdate) {
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

  const handleApply = () => {
    onUpdate({
      label: btnLabel,
      link: btnLink,
      style: btnStyle,
      color: btnColor,
    });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`${className || ''} relative group/btn cursor-pointer transition-all border-2`}
        style={{
          ...style,
          backgroundColor: btnStyle === 'filled' ? btnColor : 'transparent',
          borderColor: btnColor,
          color: btnStyle === 'filled' ? '#fff' : btnColor,
        }}
        title="Click to configure CTA button"
      >
        <span>{btnLabel}</span>
        <span className="ml-1 opacity-60 text-[10px]">⚙</span>
      </button>

      {/* Button Configuration Popover */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 top-full mt-2 left-0 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 text-slate-800 text-left font-sans text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span>🔘</span> Button Settings
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 font-bold p-1"
            >
              ✕
            </button>
          </div>

          {/* Button Text */}
          <div className="mb-2.5">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Label Text</label>
            <input
              type="text"
              value={btnLabel}
              onChange={(e) => setBtnLabel(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {/* Destination URL */}
          <div className="mb-2.5">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Destination Link</label>
            <input
              type="text"
              value={btnLink}
              onChange={(e) => setBtnLink(e.target.value)}
              placeholder="/products"
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500"
            />
            {/* Quick Link Chips */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {[
                { l: 'Shop All', u: '/products' },
                { l: 'Jewelry', u: '/products?category=jewelry' },
                { l: 'Knitwear', u: '/products?category=knitwear' },
                { l: 'Lookbook', u: '/lookbook' },
                { l: 'Membership', u: '/membership' },
              ].map(chip => (
                <button
                  key={chip.u}
                  type="button"
                  onClick={() => setBtnLink(chip.u)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px]"
                >
                  {chip.l}
                </button>
              ))}
            </div>
          </div>

          {/* Style & Color */}
          <div className="mb-3">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Style & Color</label>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setBtnStyle('filled')}
                className={`flex-1 py-1 rounded border text-xs font-semibold ${btnStyle === 'filled' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}
              >
                Filled
              </button>
              <button
                type="button"
                onClick={() => setBtnStyle('outline')}
                className={`flex-1 py-1 rounded border text-xs font-semibold ${btnStyle === 'outline' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}
              >
                Outline
              </button>
            </div>
            {/* Color swatches */}
            <div className="flex items-center gap-2">
              {[
                { name: 'Orange', c: '#ff6c2f' },
                { name: 'Dark', c: '#1e293b' },
                { name: 'Brown', c: '#5c3a24' },
                { name: 'Gold', c: '#8B5A3C' },
                { name: 'Emerald', c: '#059669' },
              ].map(item => (
                <button
                  key={item.c}
                  type="button"
                  onClick={() => setBtnColor(item.c)}
                  className="w-5 h-5 rounded-full border border-black/20 cursor-pointer"
                  style={{ backgroundColor: item.c, outline: btnColor === item.c ? '2px solid #3b82f6' : 'none' }}
                  title={item.name}
                />
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

