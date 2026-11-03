import React from 'react';
import { getPagePublished } from '../../actions';
import { RenderSection } from '../../../components/cms/SectionRenderer';
import { CareGuide } from '../../../views/CareGuide';

export const metadata = {
  title: 'Care Guide | Waveron Atelier',
  description: 'Care instructions and restoration for fine gold jewelry and pure Mongolian cashmere.',
};

export default async function Page() {
  const publishedSections = await getPagePublished('care-guide');
  if (publishedSections && publishedSections.length > 0) {
    return (
      <div className="w-full">
        {publishedSections.map((s) => (
          <RenderSection key={s.id} s={s} />
        ))}
      </div>
    );
  }
  return <CareGuide />;
}
