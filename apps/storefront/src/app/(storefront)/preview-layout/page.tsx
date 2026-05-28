import React from 'react';
import { Hero } from '../../../components/Hero';
import { PromoCards } from '../../../components/PromoCards';
import { CategoryGrid } from '../../../components/CategoryGrid';
import { ProductGrid } from '../../../components/ProductGrid';
import { PromoBanner } from '../../../components/PromoBanner';
import { BrandStrip } from '../../../components/BrandStrip';
import { StylistBanner } from '../../../components/StylistBanner';
import { SeoContent } from '../../../components/SeoContent';

export default function PreviewLayoutPage({
  searchParams,
}: {
  searchParams: { layout?: string };
}) {
  const blocks = searchParams.layout ? searchParams.layout.split(',') : [];

  return (
    <div className="w-full">
      {blocks.map((block, index) => {
        switch (block) {
          case 'Hero':
            return <Hero key={index} />;
          case 'PromoCards':
            return <PromoCards key={index} />;
          case 'CategoryGrid':
            return <CategoryGrid key={index} />;
          case 'ProductGrid_Trending':
            return <ProductGrid key={index} title="Trending Now" limit={8} />;
          case 'PromoBanner':
            return <PromoBanner key={index} />;
          case 'BrandStrip':
            return <BrandStrip key={index} />;
          case 'StylistBanner':
            return <StylistBanner key={index} />;
          case 'ProductGrid_Bestsellers':
            return <ProductGrid key={index} title="Bestsellers" limit={8} />;
          case 'SeoContent':
            return <SeoContent key={index} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
