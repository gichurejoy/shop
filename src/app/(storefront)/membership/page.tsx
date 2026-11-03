import React from 'react';
import { getPagePublished } from '../../actions';
import { RenderSection } from '../../../components/cms/SectionRenderer';
import { Membership } from '../../../views/Membership';

export const metadata = {
  title: 'VIP Membership & Atelier Privé | Waveron Atelier',
  description: 'Exclusive client tier benefits, private concierge stylist, and early gemstone drops.',
};

export default async function Page() {
  const publishedSections = await getPagePublished('membership');
  if (publishedSections && publishedSections.length > 0) {
    return (
      <div className="w-full">
        {publishedSections.map((s) => (
          <RenderSection key={s.id} s={s} />
        ))}
      </div>
    );
  }
  return <Membership />;
}
