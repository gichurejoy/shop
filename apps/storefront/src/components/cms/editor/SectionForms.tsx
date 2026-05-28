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
