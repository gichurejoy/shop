import React from 'react';
import { getPagePublished } from '../../actions';
import { RenderSection } from '../../../components/cms/SectionRenderer';
import { Lookbook } from '../../../views/Lookbook';

export const metadata = {
  title: 'Lookbook & Editorial | Waveron Atelier',
  description: 'Curated seasonal lookbooks featuring fine jewelry and artisanal knitwear.',
};

export default async function Page() {
  const publishedSections = await getPagePublished('lookbook');
  if (publishedSections && publishedSections.length > 0) {
    return (
      <div className="w-full">
        {publishedSections.map((s) => (
          <RenderSection key={s.id} s={s} />
        ))}
      </div>
    );
  }
  return <Lookbook />;
}
