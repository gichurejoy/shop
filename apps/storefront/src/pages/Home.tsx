import React from 'react';
import { getHomepagePublished } from '../app/actions';
import { renderSection } from '../components/cms/SectionRenderer';

export async function Home() {
  const sections = await getHomepagePublished();

  return (
    <div className="w-full">
      {sections.map(s => renderSection(s))}
    </div>
  );
}