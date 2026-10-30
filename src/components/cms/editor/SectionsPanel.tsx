import React, { useState } from 'react';
import { useCms } from './cms-store';
import { SectionType } from '../../../lib/cms-types';
import { SectionForms } from './SectionForms';

const AVAILABLE_BLOCKS: { id: SectionType; name: string; icon: string; desc: string; color: string }[] = [
  // Bespoke Storefront Blocks
  { id: 'hero', name: 'Hero Banner', icon: 'solar:gallery-wide-bold', desc: 'The main storefront header banner.', color: '#3b82f6' },
  { id: 'promo-cards', name: 'Promo Cards', icon: 'solar:widget-5-bold', desc: 'Row of promotional guarantee cards.', color: '#8b5cf6' },
  { id: 'category-grid', name: 'Category Grid', icon: 'solar:map-bold', desc: 'Visual links to your main store categories.', color: '#ec4899' },
  { id: 'featured-products', name: 'Product Grid', icon: 'solar:cart-large-bold', desc: 'A grid of products (e.g. Trending, Bestsellers).', color: '#14b8a6' },
  { id: 'promo-banner', name: 'Promo Banner', icon: 'solar:tag-horizontal-bold', desc: 'A wide promotional banner image.', color: '#f59e0b' },
  { id: 'brand-strip', name: 'Brand Strip', icon: 'solar:shield-star-bold', desc: 'Logos of brands you carry or trust badges.', color: '#f59e0b' },
  { id: 'stylist-banner', name: 'Stylist Banner', icon: 'solar:user-rounded-bold', desc: 'Personal stylist promotional section.', color: '#6366f1' },
  { id: 'seo-content', name: 'SEO Content', icon: 'solar:document-text-bold', desc: 'Bottom SEO-optimized text area.', color: '#64748b' },
  
  // Generic CMS Blocks
  { id: 'flash-sale', name: 'Flash Sale', icon: 'solar:bolt-circle-bold', desc: 'Urgency-driven countdown banner.', color: '#ef4444' },
  { id: 'testimonials', name: 'Testimonials', icon: 'solar:chat-round-like-bold', desc: 'Customer reviews and social proof.', color: '#10b981' },
  { id: 'rich-content', name: 'Rich Content', icon: 'solar:document-text-bold', desc: 'Text blocks, SEO content, and embedded media.', color: '#64748b' },
  { id: 'newsletter', name: 'Newsletter', icon: 'solar:letter-bold', desc: 'Email capture form for marketing.', color: '#0ea5e9' },
  { id: 'stats', name: 'Stats / Trust', icon: 'solar:chart-square-bold', desc: 'Numerical statistics and guarantees.', color: '#14b8a6' },
  { id: 'video', name: 'Video', icon: 'solar:video-frame-play-bold', desc: 'Embed YouTube or local promotional videos.', color: '#f43f5e' },
  { id: 'custom-html', name: 'Custom HTML', icon: 'solar:code-square-bold', desc: 'Raw HTML and inline CSS for advanced users.', color: '#3f3f46' },
];

export function SectionsPanel() {
  const { sections, activeId, setActive, addSection, removeSection, moveSection, duplicateSection } = useCms();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const activeSection = sections.find(s => s.id === activeId);

  if (activeSection) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc' }}>
          <button
            onClick={() => setActive(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>
            {activeSection.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())} Settings
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <SectionForms section={activeSection} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>Page Sections</div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {sections.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 20px' }}>
            No sections added yet. Click below to start building.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sections.map((s, idx) => {
              const blockInfo = AVAILABLE_BLOCKS.find(b => b.id === s.type);
              return (
                <div
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '12px', background: '#fff',
                    border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                     <iconify-icon icon={blockInfo?.icon || 'solar:box-bold'}></iconify-icon>
                  </div>
                  <div style={{ flex: 1, fontWeight: 500, color: '#334155', fontSize: '14px' }}>
                    {blockInfo?.name || s.type}
                  </div>
                  {!s.visible && <div style={{ fontSize: '12px', color: '#94a3b8', marginRight: '8px' }}>Hidden</div>}
                  
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <button 
                        onClick={() => moveSection(s.id, 'up')} disabled={idx === 0}
                        style={{ border: 'none', background: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: idx === 0 ? '#cbd5e1' : '#64748b', padding: 0, height: '12px' }}
                      >▲</button>
                      <button 
                        onClick={() => moveSection(s.id, 'down')} disabled={idx === sections.length - 1}
                        style={{ border: 'none', background: 'none', cursor: idx === sections.length - 1 ? 'not-allowed' : 'pointer', color: idx === sections.length - 1 ? '#cbd5e1' : '#64748b', padding: 0, height: '12px' }}
                      >▼</button>
                    </div>
                    <button
                      onClick={() => { if(confirm('Remove this section?')) removeSection(s.id); }}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                    >
                      <iconify-icon icon="solar:trash-bin-minimalistic-bold"></iconify-icon>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Add Section Menu */}
        <div style={{ marginTop: '24px' }}>
          {!showAddMenu ? (
            <button
              onClick={() => setShowAddMenu(true)}
              style={{
                width: '100%', padding: '12px', background: '#f8fafc', border: '1px dashed #cbd5e1',
                borderRadius: '8px', color: '#3b82f6', fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <iconify-icon icon="solar:add-circle-bold"></iconify-icon> Add Section
            </button>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>Select Section to Add</span>
                <button onClick={() => setShowAddMenu(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}>✕</button>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '12px', display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {AVAILABLE_BLOCKS.map(block => (
                  <div
                    key={block.id}
                    onClick={() => {
                      addSection(block.id);
                      setShowAddMenu(false);
                    }}
                    style={{
                      padding: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px',
                      cursor: 'pointer', border: '1px solid #e2e8f0', borderRadius: '8px',
                      transition: 'all 0.2s', background: '#fff'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = block.color; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '8px', 
                      background: `${block.color}15`, color: block.color, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                    }}>
                      <iconify-icon icon={block.icon} style={{ fontSize: '24px' }}></iconify-icon>
                    </div>
                    <div>
                      <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{block.name}</div>
                      <div style={{ color: '#64748b', fontSize: '12px', lineHeight: '1.4' }}>{block.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
