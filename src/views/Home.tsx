import React from 'react';
import { getHomepagePublished } from '../app/actions';
import { RenderSection } from '../components/cms/SectionRenderer';

export async function Home() {
  const sections = await getHomepagePublished();

  return (
    <div className="w-full">
      {sections.map(s => (
        <RenderSection key={s.id} s={s} />
      ))}
    </div>
  );
}
export default Home;
