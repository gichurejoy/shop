import React from 'react';
import { useCms } from './cms-store';
import { CmsSection } from '../../../lib/cms-types';

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

  const update = (patch: Partial<CmsSection>) => {
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
              <Select label="Columns" value={String(section.columns)} onChange={v => update({ columns: Number(v) })} options={[
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
            <FieldGroup title="Categories">
              <Input label="Category 1 Label (default: Rings)" value={(section as any).cat1Label || ''} onChange={v => update({ cat1Label: v })} />
              <Input label="Category 2 Label (default: Necklaces)" value={(section as any).cat2Label || ''} onChange={v => update({ cat2Label: v })} />
              <Input label="Category 3 Label (default: Earrings)" value={(section as any).cat3Label || ''} onChange={v => update({ cat3Label: v })} />
              <Input label="Category 4 Label (default: Bracelets)" value={(section as any).cat4Label || ''} onChange={v => update({ cat4Label: v })} />
              <Input label="Category 5 Label (default: Watches)" value={(section as any).cat5Label || ''} onChange={v => update({ cat5Label: v })} />
              <Input label="Category 6 Label (default: Cardigans)" value={(section as any).cat6Label || ''} onChange={v => update({ cat6Label: v })} />
              <Input label="Category 7 Label (default: Pullovers)" value={(section as any).cat7Label || ''} onChange={v => update({ cat7Label: v })} />
              <Input label="Category 8 Label (default: Cashmere)" value={(section as any).cat8Label || ''} onChange={v => update({ cat8Label: v })} />
              <Input label="Category 9 Label (default: Turtlenecks)" value={(section as any).cat9Label || ''} onChange={v => update({ cat9Label: v })} />
              <Input label="Category 10 Label (default: Vests)" value={(section as any).cat10Label || ''} onChange={v => update({ cat10Label: v })} />
            </FieldGroup>
          </>
        );

      case 'promo-cards':
        return (
          <>
            <FieldGroup title="Card 1 (Jewelry Offer)">
              <Input label="Title" value={(section as any).card1Title || ''} onChange={v => update({ card1Title: v })} />
              <Input label="Subtitle" value={(section as any).card1Subtitle || ''} onChange={v => update({ card1Subtitle: v })} />
              <Input label="Badge" value={(section as any).card1Badge || ''} onChange={v => update({ card1Badge: v })} />
            </FieldGroup>
            <FieldGroup title="Card 2 (Stylist)">
              <Input label="Title" value={(section as any).card2Title || ''} onChange={v => update({ card2Title: v })} />
              <Input label="Subtitle" value={(section as any).card2Subtitle || ''} onChange={v => update({ card2Subtitle: v })} />
              <Input label="Badge" value={(section as any).card2Badge || ''} onChange={v => update({ card2Badge: v })} />
            </FieldGroup>
            <FieldGroup title="Card 3 (Care Plan)">
              <Input label="Title" value={(section as any).card3Title || ''} onChange={v => update({ card3Title: v })} />
              <Input label="Subtitle" value={(section as any).card3Subtitle || ''} onChange={v => update({ card3Subtitle: v })} />
              <Input label="Badge" value={(section as any).card3Badge || ''} onChange={v => update({ card3Badge: v })} />
            </FieldGroup>
            <FieldGroup title="Card 4 (Sizing)">
              <Input label="Title" value={(section as any).card4Title || ''} onChange={v => update({ card4Title: v })} />
              <Input label="Subtitle" value={(section as any).card4Subtitle || ''} onChange={v => update({ card4Subtitle: v })} />
              <Input label="Badge" value={(section as any).card4Badge || ''} onChange={v => update({ card4Badge: v })} />
            </FieldGroup>
          </>
        );

      case 'promo-banner':
        return (
          <FieldGroup title="Promo Banner Content">
            <Input label="Title" value={(section as any).title || ''} onChange={v => update({ title: v })} />
            <Input label="Description" value={(section as any).description || ''} onChange={v => update({ description: v })} />
            <Input label="Button Label" value={(section as any).ctaLabel || ''} onChange={v => update({ ctaLabel: v })} />
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
            <FieldGroup title="Content">
              <Input label="Section Title" value={section.title || ''} onChange={v => update({ title: v })} />
              <Input label="Description" value={section.description || ''} onChange={v => update({ description: v })} />
              <Input label="Button Label" value={section.ctaLabel || ''} onChange={v => update({ ctaLabel: v })} />
            </FieldGroup>
          </>
        );

      case 'seo-content':
        return (
          <>
            <FieldGroup title="Section 1">
              <Input label="Title 1" value={section.title1 || ''} onChange={v => update({ title1: v })} />
              <Input label="Body 1" value={section.body1 || ''} onChange={v => update({ body1: v })} />
            </FieldGroup>
            <FieldGroup title="Section 2">
              <Input label="Title 2" value={section.title2 || ''} onChange={v => update({ title2: v })} />
              <Input label="Body 2" value={section.body2 || ''} onChange={v => update({ body2: v })} />
            </FieldGroup>
            <FieldGroup title="Section 3">
              <Input label="Title 3" value={section.title3 || ''} onChange={v => update({ title3: v })} />
              <Input label="Body 3" value={section.body3 || ''} onChange={v => update({ body3: v })} />
            </FieldGroup>
          </>
        );

      // We add other sections as needed. A default fallback for now:
      default:
        return (
          <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', padding: '20px 0' }}>
            Settings for {section.type} are under construction.
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
