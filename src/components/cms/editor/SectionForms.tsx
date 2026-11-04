import React from 'react';
import { useCms } from './cms-store';
import { CmsSection } from '@/lib/cms-types';

function FieldGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string, value: any, onChange: (v: any) => void, type?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: '#334155', marginBottom: '6px', fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#cbd5e1'}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string, value: any, onChange: (v: any) => void, options: { label: string, value: string }[] }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: '#334155', marginBottom: '6px', fontWeight: 500 }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#fff' }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: '16px', height: '16px' }} />
      {label}
    </label>
  );
}

// ─── Section Forms ──────────────────────────────────────────────────────────

export function SectionForms({ section }: { section: CmsSection }) {
  const { updateSection } = useCms();

  const update = (patch: any) => {
    updateSection(section.id, patch);
  };

  const renderSpecificForm = () => {
    switch (section.type) {
      case 'hero':
        return (
          <>
            <FieldGroup title="Layout & Background">
              <Select label="Layout" value={section.layout} onChange={v => update({ layout: v })} options={[
                { label: 'Full Width', value: 'full-width' },
                { label: 'Centered', value: 'centered' },
              ]} />
              <Select label="Background Type" value={section.backgroundType} onChange={v => update({ backgroundType: v })} options={[
                { label: 'Image', value: 'image' },
                { label: 'Gradient', value: 'gradient' },
                { label: 'Solid Color', value: 'solid' },
              ]} />
              {section.backgroundType === 'image' && <Input label="Image URL" value={section.backgroundImage} onChange={v => update({ backgroundImage: v })} />}
              {section.backgroundType === 'gradient' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input type="color" label="From" value={section.gradientFrom} onChange={v => update({ gradientFrom: v })} />
                  <Input type="color" label="To" value={section.gradientTo} onChange={v => update({ gradientTo: v })} />
                </div>
              )}
              {section.backgroundType === 'solid' && <Input type="color" label="Color" value={section.backgroundColor} onChange={v => update({ backgroundColor: v })} />}
              <Input type="number" label="Minimum Height (px)" value={section.minHeight} onChange={v => update({ minHeight: v })} />
            </FieldGroup>

            <FieldGroup title="Content">
              <Input label="Heading" value={section.heading} onChange={v => update({ heading: v })} />
              <Input type="number" label="Heading Size (px)" value={section.headingSize} onChange={v => update({ headingSize: v })} />
              <Input label="Subheading" value={section.subheading} onChange={v => update({ subheading: v })} />
              <Input type="color" label="Text Color" value={section.textColor} onChange={v => update({ textColor: v })} />
              <Select label="Text Alignment" value={section.textAlign} onChange={v => update({ textAlign: v })} options={[
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ]} />
            </FieldGroup>

            <FieldGroup title="Buttons">
              <Input label="Primary Button Label" value={section.cta1Label} onChange={v => update({ cta1Label: v })} />
              <Input label="Primary Button Link" value={section.cta1Link} onChange={v => update({ cta1Link: v })} />
              <Select label="Primary Style" value={section.cta1Style} onChange={v => update({ cta1Style: v })} options={[
                { label: 'Filled', value: 'filled' },
                { label: 'Outline', value: 'outline' },
              ]} />
              <Input type="color" label="Primary Color" value={section.cta1Color} onChange={v => update({ cta1Color: v })} />
              
              <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />

              <Input label="Secondary Button Label" value={section.cta2Label} onChange={v => update({ cta2Label: v })} />
              <Input label="Secondary Button Link" value={section.cta2Link} onChange={v => update({ cta2Link: v })} />
              <Select label="Secondary Style" value={section.cta2Style} onChange={v => update({ cta2Style: v })} options={[
                { label: 'Filled', value: 'filled' },
                { label: 'Outline', value: 'outline' },
              ]} />
              <Input type="color" label="Secondary Color" value={section.cta2Color} onChange={v => update({ cta2Color: v })} />
            </FieldGroup>
          </>
        );

      case 'featured-products':
        return (
          <>
            <FieldGroup title="Header">
              <Input label="Section Title" value={section.title} onChange={v => update({ title: v })} />
              <Input label="Subtitle" value={section.subtitle} onChange={v => update({ subtitle: v })} />
            </FieldGroup>
            <FieldGroup title="Display Options">
              <Select label="Columns" value={String(section.columns)} onChange={v => update({ columns: Number(v) as 2 | 3 | 4 | 6 })} options={[
                { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }, { label: '5', value: '5' }
              ]} />
              <Input type="number" label="Max Products" value={section.maxProducts} onChange={v => update({ maxProducts: v })} />
              <Toggle label="Show Price" checked={section.showPrice} onChange={v => update({ showPrice: v })} />
              <Toggle label="Show Add to Cart" checked={section.showAddToCart} onChange={v => update({ showAddToCart: v })} />
              <Toggle label="Show Discount Badge" checked={section.showDiscountBadge} onChange={v => update({ showDiscountBadge: v })} />
            </FieldGroup>
            <FieldGroup title="Style">
              <Input type="color" label="Background Color" value={section.backgroundColor} onChange={v => update({ backgroundColor: v })} />
            </FieldGroup>
          </>
        );

      case 'category-grid':
        return (
          <>
            <FieldGroup title="Header">
              <Input label="Section Title" value={section.title || ''} onChange={v => update({ title: v })} />
            </FieldGroup>
            <FieldGroup title="Category Labels">
              <Input label="Category 1 Label" value={(section as any).cat1Label || ''} onChange={v => update({ cat1Label: v })} />
              <Input label="Category 2 Label" value={(section as any).cat2Label || ''} onChange={v => update({ cat2Label: v })} />
              <Input label="Category 3 Label" value={(section as any).cat3Label || ''} onChange={v => update({ cat3Label: v })} />
              <Input label="Category 4 Label" value={(section as any).cat4Label || ''} onChange={v => update({ cat4Label: v })} />
              <Input label="Category 5 Label" value={(section as any).cat5Label || ''} onChange={v => update({ cat5Label: v })} />
              <Input label="Category 6 Label" value={(section as any).cat6Label || ''} onChange={v => update({ cat6Label: v })} />
              <Input label="Category 7 Label" value={(section as any).cat7Label || ''} onChange={v => update({ cat7Label: v })} />
              <Input label="Category 8 Label" value={(section as any).cat8Label || ''} onChange={v => update({ cat8Label: v })} />
              <Input label="Category 9 Label" value={(section as any).cat9Label || ''} onChange={v => update({ cat9Label: v })} />
              <Input label="Category 10 Label" value={(section as any).cat10Label || ''} onChange={v => update({ cat10Label: v })} />
            </FieldGroup>
          </>
        );

      case 'promo-cards':
        return (
          <>
            <FieldGroup title="Card 1 (Delivery & Speed)">
              <Input label="Title" value={(section as any).card1Title || ''} onChange={v => update({ card1Title: v })} />
              <Input label="Subtitle" value={(section as any).card1Subtitle || ''} onChange={v => update({ card1Subtitle: v })} />
              <Input label="Badge" value={(section as any).card1Badge || ''} onChange={v => update({ card1Badge: v })} />
              <Input label="Link" value={(section as any).card1Link || ''} onChange={v => update({ card1Link: v })} />
            </FieldGroup>
            <FieldGroup title="Card 2 (Support & Advice)">
              <Input label="Title" value={(section as any).card2Title || ''} onChange={v => update({ card2Title: v })} />
              <Input label="Subtitle" value={(section as any).card2Subtitle || ''} onChange={v => update({ card2Subtitle: v })} />
              <Input label="Badge" value={(section as any).card2Badge || ''} onChange={v => update({ card2Badge: v })} />
              <Input label="Link" value={(section as any).card2Link || ''} onChange={v => update({ card2Link: v })} />
            </FieldGroup>
            <FieldGroup title="Card 3 (Quality & Warranty)">
              <Input label="Title" value={(section as any).card3Title || ''} onChange={v => update({ card3Title: v })} />
              <Input label="Subtitle" value={(section as any).card3Subtitle || ''} onChange={v => update({ card3Subtitle: v })} />
              <Input label="Badge" value={(section as any).card3Badge || ''} onChange={v => update({ card3Badge: v })} />
              <Input label="Link" value={(section as any).card3Link || ''} onChange={v => update({ card3Link: v })} />
            </FieldGroup>
            <FieldGroup title="Card 4 (Returns & Protection)">
              <Input label="Title" value={(section as any).card4Title || ''} onChange={v => update({ card4Title: v })} />
              <Input label="Subtitle" value={(section as any).card4Subtitle || ''} onChange={v => update({ card4Subtitle: v })} />
              <Input label="Badge" value={(section as any).card4Badge || ''} onChange={v => update({ card4Badge: v })} />
              <Input label="Link" value={(section as any).card4Link || ''} onChange={v => update({ card4Link: v })} />
            </FieldGroup>
          </>
        );

      case 'promo-banner':
        return (
          <FieldGroup title="Promo Banner Content">
            <Input label="Title" value={(section as any).title || ''} onChange={v => update({ title: v })} />
            <Input label="Description" value={(section as any).description || ''} onChange={v => update({ description: v })} />
            <Input label="Button Label" value={(section as any).ctaLabel || ''} onChange={v => update({ ctaLabel: v })} />
            <Input label="Button Link" value={(section as any).ctaLink || ''} onChange={v => update({ ctaLink: v })} />
          </FieldGroup>
        );

      case 'brand-strip':
        return (
          <>
            <FieldGroup title="Header">
              <Input label="Section Title" value={section.title || ''} onChange={v => update({ title: v })} />
            </FieldGroup>
            <FieldGroup title="Brands">
              <Input 
                label="Brand Names (comma-separated)" 
                value={typeof section.brands === 'string' ? section.brands : Array.isArray(section.brands) ? section.brands.join(', ') : ''} 
                onChange={v => update({ brands: v })} 
              />
            </FieldGroup>
          </>
        );

      case 'stylist-banner':
        return (
          <>
            <FieldGroup title="Consultation & Inquiries Banner">
              <Input label="Section Title" value={section.title || ''} onChange={v => update({ title: v })} />
              <Input label="Description" value={section.description || ''} onChange={v => update({ description: v })} />
              <Input label="Button Label" value={section.ctaLabel || ''} onChange={v => update({ ctaLabel: v })} />
              <Input label="Button Link" value={(section as any).ctaLink || '/about'} onChange={v => update({ ctaLink: v })} />
            </FieldGroup>
          </>
        );

      case 'seo-content':
        return (
          <>
            <FieldGroup title="Topic 1 (Quality & Standards)">
              <Input label="Title 1" value={section.title1 || ''} onChange={v => update({ title1: v })} />
              <Input label="Body 1" value={section.body1 || ''} onChange={v => update({ body1: v })} />
            </FieldGroup>
            <FieldGroup title="Topic 2 (Shipping & Handling)">
              <Input label="Title 2" value={section.title2 || ''} onChange={v => update({ title2: v })} />
              <Input label="Body 2" value={section.body2 || ''} onChange={v => update({ body2: v })} />
            </FieldGroup>
            <FieldGroup title="Topic 3 (Warranty & Bulk Inquiries)">
              <Input label="Title 3" value={section.title3 || ''} onChange={v => update({ title3: v })} />
              <Input label="Body 3" value={section.body3 || ''} onChange={v => update({ body3: v })} />
            </FieldGroup>
          </>
        );

      case 'flash-sale':
        return (
          <FieldGroup title="Flash Sale Settings">
            <Input label="Sale Badge" value={(section as any).badge || 'LIMITED OFFER'} onChange={v => update({ badge: v })} />
            <Input label="Sale Heading" value={(section as any).heading || 'Flash Sale'} onChange={v => update({ heading: v })} />
            <Input label="Subheading" value={(section as any).subheading || ''} onChange={v => update({ subheading: v })} />
            <Input label="Discount Text" value={(section as any).discount || 'Up to 50% OFF'} onChange={v => update({ discount: v })} />
            <Input label="Button Label" value={(section as any).ctaLabel || 'Shop Flash Deals'} onChange={v => update({ ctaLabel: v })} />
            <Input label="Button Link" value={(section as any).ctaLink || '/products'} onChange={v => update({ ctaLink: v })} />
            <Input type="color" label="Background Color" value={(section as any).backgroundColor || '#0f172a'} onChange={v => update({ backgroundColor: v })} />
          </FieldGroup>
        );

      case 'testimonials':
        return (
          <FieldGroup title="Customer Reviews">
            <Input label="Section Title" value={(section as any).title || 'What Our Customers Say'} onChange={v => update({ title: v })} />
            <Input label="Subtitle" value={(section as any).subtitle || 'Real feedback from satisfied buyers'} onChange={v => update({ subtitle: v })} />
          </FieldGroup>
        );

      case 'newsletter':
        return (
          <FieldGroup title="Newsletter Signup">
            <Input label="Heading" value={(section as any).heading || 'Stay in the Loop'} onChange={v => update({ heading: v })} />
            <Input label="Subheading" value={(section as any).subheading || 'Get exclusive deals, new arrivals and trade offers directly in your inbox.'} onChange={v => update({ subheading: v })} />
            <Input label="Button Label" value={(section as any).buttonLabel || 'Subscribe'} onChange={v => update({ buttonLabel: v })} />
            <Input label="Placeholder Text" value={(section as any).placeholder || 'Enter your email address'} onChange={v => update({ placeholder: v })} />
          </FieldGroup>
        );

      case 'stats':
        return (
          <FieldGroup title="Key Numbers & Trust Indicators">
            <Input label="Title" value={(section as any).title || 'Trusted by Thousands'} onChange={v => update({ title: v })} />
            <Input label="Stat 1 Value" value={(section as any).stat1Value || '10,000+'} onChange={v => update({ stat1Value: v })} />
            <Input label="Stat 1 Label" value={(section as any).stat1Label || 'Orders Fulfilled'} onChange={v => update({ stat1Label: v })} />
            <Input label="Stat 2 Value" value={(section as any).stat2Value || '99.8%'} onChange={v => update({ stat2Value: v })} />
            <Input label="Stat 2 Label" value={(section as any).stat2Label || 'Satisfaction Rate'} onChange={v => update({ stat2Label: v })} />
            <Input label="Stat 3 Value" value={(section as any).stat3Value || '24h'} onChange={v => update({ stat3Value: v })} />
            <Input label="Stat 3 Label" value={(section as any).stat3Label || 'Dispatch Time'} onChange={v => update({ stat3Label: v })} />
          </FieldGroup>
        );

      case 'video':
        return (
          <FieldGroup title="Video Embed">
            <Input label="Video URL (YouTube or Vimeo)" value={(section as any).videoUrl || ''} onChange={v => update({ videoUrl: v })} />
            <Input label="Overlay Text" value={(section as any).overlayText || ''} onChange={v => update({ overlayText: v })} />
            <Toggle label="Autoplay" checked={Boolean((section as any).autoplay)} onChange={v => update({ autoplay: v })} />
            <Toggle label="Muted" checked={Boolean((section as any).muted)} onChange={v => update({ muted: v })} />
            <Toggle label="Loop" checked={Boolean((section as any).loop)} onChange={v => update({ loop: v })} />
          </FieldGroup>
        );

      case 'custom-html':
        return (
          <FieldGroup title="Custom HTML Code">
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#334155', marginBottom: '6px', fontWeight: 500 }}>HTML / Embed Code</label>
              <textarea
                value={(section as any).html || ''}
                onChange={e => update({ html: e.target.value })}
                rows={8}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'monospace', outline: 'none' }}
              />
            </div>
          </FieldGroup>
        );

      default:
        return (
          <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', padding: '20px 0' }}>
            Click any text or image in the preview to edit directly, or adjust block settings above.
          </div>
        );
    }
  };

  return (
    <div>
      {/* Global Settings */}
      <FieldGroup title="Global Settings">
        <Toggle label="Section Visible" checked={section.visible} onChange={v => update({ visible: v })} />
        <Select label="Theme Variant" value={section.variant || 'default'} onChange={v => update({ variant: v })} options={[
          { label: 'Default', value: 'default' },
          { label: 'Light Theme', value: 'light' },
          { label: 'Dark Theme', value: 'dark' },
          { label: 'Minimal', value: 'minimal' },
        ]} />
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Input type="number" label="Padding Top (px)" value={section.paddingTop} onChange={v => update({ paddingTop: v })} />
          </div>
          <div style={{ flex: 1 }}>
            <Input type="number" label="Padding Bottom (px)" value={section.paddingBottom} onChange={v => update({ paddingBottom: v })} />
          </div>
        </div>
      </FieldGroup>

      <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />

      {/* Specific Settings */}
      {renderSpecificForm()}
    </div>
  );
}
