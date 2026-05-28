// ─── Shared base ───────────────────────────────────────────────────────────
export type SectionBase = {
  id: string;
  visible: boolean;
  mobileHidden: boolean;
  desktopHidden: boolean;
  paddingTop: number;
  paddingBottom: number;
  sectionId: string; // for anchor links
  scrollAnimation: 'fade' | 'slide-up' | 'none';
};

// ─── Hero ──────────────────────────────────────────────────────────────────
export type HeroSection = SectionBase & {
  type: 'hero';
  layout: 'full-width' | 'split-left' | 'centered';
  backgroundType: 'image' | 'video' | 'gradient' | 'solid';
  backgroundImage: string;
  backgroundVideo: string;
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  overlayColor: string;
  overlayOpacity: number;
  heading: string;
  headingSize: number;
  subheading: string;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  minHeight: number;
  mobileImage: string;
  cta1Label: string;
  cta1Link: string;
  cta1Style: 'filled' | 'outline';
  cta1Color: string;
  cta2Label: string;
  cta2Link: string;
  cta2Style: 'filled' | 'outline';
  cta2Color: string;
};

// ─── Featured Products ─────────────────────────────────────────────────────
export type FeaturedProductsSection = SectionBase & {
  type: 'featured-products';
  title: string;
  subtitle: string;
  displayType: 'grid' | 'carousel' | 'masonry';
  columns: 2 | 3 | 4 | 5;
  productSource: 'manual' | 'best-sellers' | 'new-arrivals' | 'on-sale' | 'top-rated';
  productIds: string[];
  maxProducts: number;
  showPrice: boolean;
  showRating: boolean;
  showAddToCart: boolean;
  showDiscountBadge: boolean;
  backgroundColor: string;
  viewAllLabel: string;
  viewAllLink: string;
};

// ─── Category Grid ─────────────────────────────────────────────────────────
export type CategoryGridSection = SectionBase & {
  type: 'category-grid';
  title: string;
  layout: 'grid' | 'horizontal-scroll' | 'masonry';
  columns: 2 | 3 | 4 | 6;
  categoryIds: string[];
  cardStyle: 'overlay' | 'below' | 'icon';
  imageShape: 'square' | 'portrait' | 'landscape' | 'circle';
  hoverEffect: 'zoom' | 'lift' | 'darken' | 'none';
  showProductCount: boolean;
};

// ─── Flash Sale ────────────────────────────────────────────────────────────
export type FlashSaleSection = SectionBase & {
  type: 'flash-sale';
  title: string;
  endDate: string;
  timerStyle: 'boxes' | 'minimal' | 'large';
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  textColor: string;
  bannerLabel: string;
  productSource: 'manual' | 'on-sale';
  productIds: string[];
};

// ─── Brand Strip ───────────────────────────────────────────────────────────
export type BrandStripSection = SectionBase & {
  type: 'brand-strip';
  title: string;
  displayType: 'logo-strip' | 'cards';
  autoScroll: boolean;
  scrollSpeed: number;
  showProductCount: boolean;
  brands: Array<{ id: string; name: string; logo: string; link: string }>;
};

// ─── Testimonials ──────────────────────────────────────────────────────────
export type TestimonialsSection = SectionBase & {
  type: 'testimonials';
  title: string;
  displayType: 'carousel' | 'grid' | 'single';
  backgroundColor: string;
  cardStyle: 'minimal' | 'bordered' | 'shadowed';
  autoPlay: boolean;
  autoPlaySpeed: number;
  items: Array<{
    id: string;
    name: string;
    photo: string;
    text: string;
    rating: number;
    company: string;
  }>;
};

// ─── Rich Content ──────────────────────────────────────────────────────────
export type RichContentSection = SectionBase & {
  type: 'rich-content';
  layout: 'full' | 'text-image' | 'image-text' | 'two-col' | 'three-col';
  backgroundColor: string;
  backgroundImage: string;
  ctaLabel: string;
  ctaLink: string;
  blocks: Array<{ id: string; content: string; imageUrl: string; imageAlt: string }>;
};

// ─── Newsletter ────────────────────────────────────────────────────────────
export type NewsletterSection = SectionBase & {
  type: 'newsletter';
  heading: string;
  subtext: string;
  placeholder: string;
  buttonLabel: string;
  buttonColor: string;
  layout: 'centered' | 'left' | 'two-column';
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundColor: string;
  backgroundImage: string;
  successMessage: string;
  integration: 'mailchimp' | 'klaviyo' | 'internal';
};

// ─── Stats / Trust Bar ─────────────────────────────────────────────────────
export type StatsSection = SectionBase & {
  type: 'stats';
  layout: 'strip' | 'grid';
  backgroundColor: string;
  animateOnScroll: boolean;
  items: Array<{ id: string; icon: string; number: string; label: string }>;
};

// ─── Video ─────────────────────────────────────────────────────────────────
export type VideoSection = SectionBase & {
  type: 'video';
  layout: 'full-width' | 'contained' | 'split';
  videoType: 'youtube' | 'vimeo' | 'upload';
  videoUrl: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  showPlayButton: boolean;
  overlayText: string;
  ctaLabel: string;
  ctaLink: string;
};

// ─── Custom HTML ────────────────────────────────────────────────────────────
export type CustomHtmlSection = SectionBase & {
  type: 'custom-html';
  html: string;
};

// ─── Bespoke Storefront Types ─────────────────────────────────────────────────
export type PromoCardsSection = SectionBase & { type: 'promo-cards' };
export type PromoBannerSection = SectionBase & { type: 'promo-banner' };
export type StylistBannerSection = SectionBase & { type: 'stylist-banner' };
export type SeoContentSection = SectionBase & { type: 'seo-content' };

// ─── Union ────────────────────────────────────────────────────────────────
export type CmsSection =
  | HeroSection
  | FeaturedProductsSection
  | CategoryGridSection
  | FlashSaleSection
  | BrandStripSection
  | TestimonialsSection
  | RichContentSection
  | NewsletterSection
  | StatsSection
  | VideoSection
  | CustomHtmlSection
  | PromoCardsSection
  | PromoBannerSection
  | StylistBannerSection
  | SeoContentSection;

export type SectionType = CmsSection['type'];

// ─── Page draft ───────────────────────────────────────────────────────────
export type CmsDraft = {
  pageId: string;
  sections: CmsSection[];
  lastSaved: string;
};

// ─── Defaults ─────────────────────────────────────────────────────────────
export function createDefaultSection(type: SectionType, id: string): CmsSection {
  const base: SectionBase = {
    id,
    visible: true,
    mobileHidden: false,
    desktopHidden: false,
    paddingTop: 48,
    paddingBottom: 48,
    sectionId: '',
    scrollAnimation: 'none',
  };
  switch (type) {
    case 'hero':
      return {
        ...base,
        type: 'hero',
        layout: 'full-width',
        backgroundType: 'gradient',
        backgroundImage: '',
        backgroundVideo: '',
        backgroundColor: '#5C3A24',
        gradientFrom: '#5C3A24',
        gradientTo: '#8B5A3C',
        overlayColor: '#000000',
        overlayOpacity: 0,
        heading: 'Welcome to our Store',
        headingSize: 48,
        subheading: 'Discover amazing products',
        textAlign: 'center',
        textColor: '#ffffff',
        minHeight: 500,
        mobileImage: '',
        cta1Label: 'Shop Now',
        cta1Link: '/products',
        cta1Style: 'filled',
        cta1Color: '#ff6c2f',
        cta2Label: '',
        cta2Link: '',
        cta2Style: 'outline',
        cta2Color: '#ffffff',
      };
    case 'featured-products':
      return {
        ...base,
        type: 'featured-products',
        title: 'Featured Products',
        subtitle: '',
        displayType: 'grid',
        columns: 4,
        productSource: 'new-arrivals',
        productIds: [],
        maxProducts: 8,
        showPrice: true,
        showRating: true,
        showAddToCart: true,
        showDiscountBadge: true,
        backgroundColor: '#ffffff',
        viewAllLabel: 'View All',
        viewAllLink: '/products',
      };
    case 'category-grid':
      return {
        ...base,
        type: 'category-grid',
        title: 'Shop by Category',
        layout: 'grid',
        columns: 4,
        categoryIds: [],
        cardStyle: 'overlay',
        imageShape: 'square',
        hoverEffect: 'zoom',
        showProductCount: true,
      };
    case 'flash-sale':
      return {
        ...base,
        type: 'flash-sale',
        title: 'Flash Sale',
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        timerStyle: 'boxes',
        backgroundType: 'gradient',
        backgroundColor: '#ef4444',
        gradientFrom: '#ef4444',
        gradientTo: '#dc2626',
        backgroundImage: '',
        textColor: '#ffffff',
        bannerLabel: 'Limited Time Deal',
        productSource: 'on-sale',
        productIds: [],
      };
    case 'brand-strip':
      return {
        ...base,
        type: 'brand-strip',
        title: 'Our Brands',
        displayType: 'logo-strip',
        autoScroll: true,
        scrollSpeed: 30,
        showProductCount: false,
        brands: [],
      };
    case 'testimonials':
      return {
        ...base,
        type: 'testimonials',
        title: 'What Our Customers Say',
        displayType: 'carousel',
        backgroundColor: '#f8fafc',
        cardStyle: 'shadowed',
        autoPlay: true,
        autoPlaySpeed: 5000,
        items: [
          { id: '1', name: 'Jane Doe', photo: '', text: 'Amazing product quality!', rating: 5, company: 'Happy Customer' },
        ],
      };
    case 'rich-content':
      return {
        ...base,
        type: 'rich-content',
        layout: 'full',
        backgroundColor: '#ffffff',
        backgroundImage: '',
        ctaLabel: '',
        ctaLink: '',
        blocks: [{ id: '1', content: '<p>Add your content here...</p>', imageUrl: '', imageAlt: '' }],
      };
    case 'newsletter':
      return {
        ...base,
        type: 'newsletter',
        heading: 'Subscribe to our Newsletter',
        subtext: 'Get the latest updates and exclusive offers.',
        placeholder: 'Enter your email...',
        buttonLabel: 'Subscribe',
        buttonColor: '#ff6c2f',
        layout: 'centered',
        backgroundType: 'solid',
        backgroundColor: '#1e293b',
        backgroundImage: '',
        successMessage: 'Thank you for subscribing!',
        integration: 'internal',
      };
    case 'stats':
      return {
        ...base,
        type: 'stats',
        layout: 'strip',
        backgroundColor: '#ffffff',
        animateOnScroll: true,
        items: [
          { id: '1', icon: '🚚', number: 'Free Shipping', label: 'On orders over $50' },
          { id: '2', icon: '⭐', number: '50k+', label: 'Happy Customers' },
          { id: '3', icon: '🔒', number: 'Secure', label: 'Safe Checkout' },
          { id: '4', icon: '↩️', number: '30 Days', label: 'Easy Returns' },
        ],
      };
    case 'video':
      return {
        ...base,
        type: 'video',
        layout: 'contained',
        videoType: 'youtube',
        videoUrl: '',
        autoplay: false,
        muted: true,
        loop: false,
        showPlayButton: true,
        overlayText: '',
        ctaLabel: '',
        ctaLink: '',
      };
    case 'custom-html':
      return {
        ...base,
        type: 'custom-html',
        html: '<!-- Add your custom HTML here -->',
      };
    case 'promo-cards': return { ...base, type: 'promo-cards' };
    case 'promo-banner': return { ...base, type: 'promo-banner' };
    case 'stylist-banner': return { ...base, type: 'stylist-banner' };
    case 'seo-content': return { ...base, type: 'seo-content' };
  }
}
