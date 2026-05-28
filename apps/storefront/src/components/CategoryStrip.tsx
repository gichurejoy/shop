import React from 'react';
import Link from 'next/link';
export function CategoryStrip() {
  const categories = [
  {
    label: 'New Arrivals',
    megaMenu: [
    {
      title: 'This Week',
      links: ['Rings', 'Necklaces', 'Sweaters', 'Cardigans']
    },
    {
      title: 'Last 14 Days',
      links: ['Earrings', 'Bracelets', 'Pullovers', 'Vests']
    },
    {
      title: 'Coming Soon',
      links: ['Bridal Collection', 'Winter Knits', 'Gold Chains']
    },
    {
      title: 'Pre-Order',
      links: ['Statement Pieces', 'Cashmere Essentials']
    },
    {
      title: 'Limited Edition',
      links: ['Holiday Collection', 'Designer Collab']
    }]

  },
  {
    label: 'Jewelry',
    megaMenu: [
    {
      title: 'Rings',
      links: [
      'Engagement',
      'Wedding Bands',
      'Stackable',
      'Statement',
      'Cocktail']

    },
    {
      title: 'Necklaces',
      links: ['Pendants', 'Chains', 'Pearl Strands', 'Chokers', 'Lariats']
    },
    {
      title: 'Earrings',
      links: ['Studs', 'Hoops', 'Drops', 'Huggies', 'Climbers']
    },
    {
      title: 'Bracelets',
      links: ['Tennis', 'Bangles', 'Cuffs', 'Charm', 'Beaded']
    },
    {
      title: 'By Metal',
      links: ['Gold', 'Rose Gold', 'Silver', 'Platinum', 'Mixed Metals']
    }]

  },
  {
    label: 'Sweaters',
    megaMenu: [
    {
      title: 'By Style',
      links: [
      'Cardigans',
      'Pullovers',
      'Turtlenecks',
      'V-necks',
      'Crewnecks']

    },
    {
      title: 'By Material',
      links: ['Cashmere', 'Merino Wool', 'Cotton', 'Alpaca', 'Mohair']
    },
    {
      title: 'By Fit',
      links: ['Oversized', 'Slim Fit', 'Cropped', 'Tunic', 'Wrap']
    },
    {
      title: 'By Occasion',
      links: ['Casual', 'Office', 'Holiday', 'Lounge', 'Travel']
    },
    {
      title: 'By Season',
      links: ['Spring', 'Summer Light', 'Fall', 'Winter Heavy']
    }]

  },
  {
    label: 'Bestsellers',
    megaMenu: [
    {
      title: 'Top Rings',
      links: ['Diamond Studs', 'Gold Bands', 'Eternity Rings']
    },
    {
      title: 'Top Necklaces',
      links: ['Initial Pendants', 'Layered Chains']
    },
    {
      title: 'Top Sweaters',
      links: ['Cashmere Crew', 'Chunky Knit Cardigan']
    },
    {
      title: 'Editor Picks',
      links: ['Must-Have Hoops', 'The Perfect Turtleneck']
    },
    {
      title: 'Customer Favorites',
      links: ['Pearl Drop Earrings', 'Ribbed Knit Vest']
    }]

  },
  {
    label: 'Sale',
    megaMenu: [
    {
      title: 'Up to 30%',
      links: ['Rings', 'Necklaces', 'Sweaters']
    },
    {
      title: '30-50% Off',
      links: ['Earrings', 'Bracelets', 'Cardigans']
    },
    {
      title: '50%+ Off',
      links: ['Last Season Knits', 'Clearance Jewelry']
    },
    {
      title: 'Clearance',
      links: ['Final Sale Items']
    },
    {
      title: 'Last Chance',
      links: ['Low Stock Alerts']
    }]

  },
  {
    label: 'Bridal',
    megaMenu: [
    {
      title: 'Engagement',
      links: ['Solitaire', 'Halo', 'Three-Stone', 'Vintage']
    },
    {
      title: 'Wedding Bands',
      links: ['Diamond', 'Plain Metal', 'Curved', 'Eternity']
    },
    {
      title: 'Bridal Sets',
      links: ['Matching Sets', 'Custom Designs']
    },
    {
      title: 'Anniversary',
      links: ['Eternity Bands', 'Diamond Necklaces']
    },
    {
      title: 'Gift Ideas',
      links: ['For the Bride', 'Bridesmaids Gifts']
    }]

  },
  {
    label: 'Men',
    megaMenu: [
    {
      title: 'Sweaters',
      links: ['Crewnecks', 'V-necks', 'Cardigans', 'Quarter-Zips']
    },
    {
      title: 'Watches',
      links: ['Dress Watches', 'Chronographs', 'Smartwatches']
    },
    {
      title: 'Rings',
      links: ['Wedding Bands', 'Signet Rings', 'Fashion Rings']
    },
    {
      title: 'Bracelets',
      links: ['Chain Bracelets', 'Leather Cuffs', 'Beaded']
    },
    {
      title: 'Cufflinks',
      links: ['Classic', 'Novelty', 'Personalized']
    }]

  },
  {
    label: 'Women',
    megaMenu: [
    {
      title: 'Rings',
      links: ['Engagement', 'Fashion', 'Stackable']
    },
    {
      title: 'Necklaces',
      links: ['Pendants', 'Chains', 'Statement']
    },
    {
      title: 'Earrings',
      links: ['Studs', 'Hoops', 'Drops']
    },
    {
      title: 'Sweaters',
      links: ['Cashmere', 'Cardigans', 'Pullovers']
    },
    {
      title: 'Accessories',
      links: ['Watches', 'Scarves', 'Bags']
    }]

  },
  {
    label: 'Accessories',
    megaMenu: [
    {
      title: 'Watches',
      links: ["Women's Watches", "Men's Watches", 'Unisex']
    },
    {
      title: 'Belts',
      links: ['Leather', 'Woven', 'Chain']
    },
    {
      title: 'Scarves',
      links: ['Silk', 'Cashmere', 'Wool']
    },
    {
      title: 'Hats',
      links: ['Beanies', 'Fedoras', 'Sun Hats']
    },
    {
      title: 'Bags',
      links: ['Totes', 'Crossbody', 'Clutches']
    }]

  }];

  return (
    <div className="w-full bg-[#3D2817] text-white relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-8 overflow-x-auto md:overflow-visible scrollbar-hide py-0">
          {categories.map((category) =>
          <div key={category.label} className="group relative">
              <button className="whitespace-nowrap text-sm font-medium hover:bg-[#8B5A3C] px-3 py-3 transition-colors">
                {category.label}
              </button>

              {/* Mega Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex overflow-hidden">
                {category.megaMenu.map((col, idx) =>
              <div
                key={col.title}
                className={`flex-1 p-6 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF6F0]'}`}>
                
                    <h3 className="font-bold text-[#3D2817] mb-4 text-sm">
                      {col.title}
                    </h3>
                    <ul className="space-y-3">
                      {col.links.map((link) =>
                  <li key={link}>
                          <Link
                      href="/"
                      className="text-sm text-gray-600 hover:text-[#8B5A3C] transition-colors">
                      
                            {link}
                          </Link>
                        </li>
                  )}
                    </ul>
                  </div>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}