'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCmsData, saveCmsData, CmsPage, CmsPost, CmsMenuNode, CmsSeoSettings, CmsAnnouncementBar, CmsFooterSettings, DEFAULT_FOOTER_SETTINGS } from '@/lib/cms';
import { CmsSection } from '@/lib/cms-types';

// ─── Universal Page Draft / Publish (Visual Builder for ALL Pages) ───────────

export async function getDefaultSectionsForPage(pageSlug: string): Promise<CmsSection[]> {
  const ts = Date.now();
  switch (pageSlug) {
    case 'about':
      return [
        {
          id: `sec-${ts}-1`,
          type: 'hero',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 0,
          paddingBottom: 0,
          sectionId: 'about-hero',
          scrollAnimation: 'none',
          layout: 'centered',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1600&q=80',
          backgroundVideo: '',
          backgroundColor: '#3D2817',
          gradientFrom: '#3D2817',
          gradientTo: '#5C3A24',
          overlayColor: '#000000',
          overlayOpacity: 45,
          heading: 'The Waveron Story',
          headingSize: 42,
          subheading: 'Handcrafted luxury jewelry and ethically sourced Mongolian cashmere, shaped by heritage artisans.',
          textAlign: 'center',
          textColor: '#ffffff',
          minHeight: 460,
          mobileImage: '',
          cta1Label: 'Our Craftsmanship',
          cta1Link: '#craft',
          cta1Style: 'filled',
          cta1Color: '#ff6c2f',
          cta2Label: 'Explore Catalog',
          cta2Link: '/products',
          cta2Style: 'outline',
          cta2Color: '#ffffff',
        } as any,
        {
          id: `sec-${ts}-2`,
          type: 'promo-cards',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'about-usps',
          scrollAnimation: 'fade',
          card1Title: 'Ethical 18k Gold',
          card1Subtitle: 'Fairmined Certified',
          card1Badge: 'Ethical',
          card1Bg: 'bg-[#FAF6F0]',
          card2Title: 'Mongolian Cashmere',
          card2Subtitle: 'Pure Grade-A Fibers',
          card2Badge: 'Pure',
          card2Bg: 'bg-[#F5EFE6]',
          card3Title: 'Master Jewelers',
          card3Subtitle: 'Hand-set Gemstones',
          card3Badge: 'Artisan',
          card3Bg: 'bg-[#E8F0E5]',
          card4Title: 'Lifetime Atelier Care',
          card4Subtitle: 'Complimentary Servicing',
          card4Badge: 'Guaranteed',
          card4Bg: 'bg-[#EDE7F3]',
        } as any,
        {
          id: `sec-${ts}-3`,
          type: 'stats',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 48,
          paddingBottom: 48,
          sectionId: 'about-stats',
          scrollAnimation: 'none',
          layout: 'strip',
          backgroundColor: '#3D2817',
          animateOnScroll: true,
          items: [
            { id: '1', icon: '💎', number: '100%', label: 'Conflict-Free Diamonds' },
            { id: '2', icon: '🧵', number: '18 Microns', label: 'Ultra-Fine Cashmere' },
            { id: '3', icon: '👑', number: '15,000+', label: 'Heirloom Pieces Delivered' },
            { id: '4', icon: '⏳', number: 'Lifetime', label: 'Warranty & Restoration' },
          ],
        } as any,
        {
          id: `sec-${ts}-4`,
          type: 'testimonials',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 56,
          paddingBottom: 56,
          sectionId: 'about-reviews',
          scrollAnimation: 'fade',
          title: 'Praised by Discerning Collectors',
          displayType: 'grid',
          backgroundColor: '#FAF6F0',
          cardStyle: 'bordered',
          autoPlay: false,
          autoPlaySpeed: 5,
          items: [
            { id: '1', name: 'Eleanor Vance', company: 'Zurich', text: 'The weight of the 18k gold signet ring is magnificent. True craftsmanship that you can immediately feel.', rating: 5, photo: '' },
            { id: '2', name: 'Marc Dupont', company: 'Paris', text: 'The ribbed cashmere sweater is softer than any heritage brand I have owned. An exceptional piece of knitwear.', rating: 5, photo: '' },
            { id: '3', name: 'Sophia Chen', company: 'London', text: 'Impeccable bespoke ring sizing and exquisite packaging. The unboxing alone feels like an atelier experience.', rating: 5, photo: '' },
          ],
        } as any,
        {
          id: `sec-${ts}-5`,
          type: 'newsletter',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 64,
          paddingBottom: 64,
          sectionId: 'about-newsletter',
          scrollAnimation: 'none',
          heading: 'Join the Private Atelier Circle',
          subtext: 'Be the first to receive private invitations to limited bespoke gemstone drops.',
          placeholder: 'Enter your preferred email...',
          buttonLabel: 'Request Invitation',
          buttonColor: '#ff6c2f',
          layout: 'centered',
          backgroundType: 'solid',
          backgroundColor: '#1E293B',
          backgroundImage: '',
          successMessage: 'Welcome to the circle.',
          integration: 'internal',
        } as any,
      ];

    case 'care-guide':
      return [
        {
          id: `sec-${ts}-1`,
          type: 'hero',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 0,
          paddingBottom: 0,
          sectionId: 'care-hero',
          scrollAnimation: 'none',
          layout: 'centered',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
          backgroundVideo: '',
          backgroundColor: '#5C3A24',
          gradientFrom: '#5C3A24',
          gradientTo: '#3D2817',
          overlayColor: '#000000',
          overlayOpacity: 45,
          heading: 'Jewelry & Knitwear Care Guide',
          headingSize: 40,
          subheading: 'Preserving the radiance of 18k precious metals and the softness of fine cashmere across generations.',
          textAlign: 'center',
          textColor: '#ffffff',
          minHeight: 420,
          mobileImage: '',
          cta1Label: 'Care Instructions',
          cta1Link: '#guide',
          cta1Style: 'filled',
          cta1Color: '#ff6c2f',
          cta2Label: 'Consult Stylist',
          cta2Link: '/membership',
          cta2Style: 'outline',
          cta2Color: '#ffffff',
        } as any,
        {
          id: `sec-${ts}-2`,
          type: 'promo-cards',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'care-cards',
          scrollAnimation: 'fade',
          card1Title: 'Gold & Diamond Care',
          card1Subtitle: 'Warm Water & Soft Bristles',
          card1Badge: 'Jewelry',
          card1Bg: 'bg-[#E8F0E5]',
          card2Title: 'Pearls & Soft Gems',
          card2Subtitle: 'Dry Cloth Only',
          card2Badge: 'Delicate',
          card2Bg: 'bg-[#EDE7F3]',
          card3Title: 'Pure Cashmere',
          card3Subtitle: 'Cool Water Handwash',
          card3Badge: 'Knitwear',
          card3Bg: 'bg-[#FCEFE3]',
          card4Title: 'Velvet Storage',
          card4Subtitle: 'Anti-Tarnish Pouches',
          card4Badge: 'Storage',
          card4Bg: 'bg-[#FAF6F0]',
        } as any,
        {
          id: `sec-${ts}-3`,
          type: 'seo-content',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 40,
          paddingBottom: 40,
          sectionId: 'care-text',
          scrollAnimation: 'none',
          title1: 'Everyday Jewelry Preservation Routine',
          body1: 'Remove your rings and necklaces before swimming, exercising, or applying lotions and perfumes. Chemicals in chlorine and cosmetics can diminish the brilliance of natural gemstones.',
          title2: 'Cashmere Washing and Air Drying',
          body2: 'Never machine-wash or wring pure cashmere. Soak gently in lukewarm water with mild wool detergent, press out moisture between dry cotton towels, and dry flat on a horizontal rack.',
          title3: 'Complimentary Annual Atelier Inspection',
          body3: 'Waveron patrons are entitled to complimentary annual prong checking, ultrasonic gemstone cleansing, and knit de-pilling at our workshop.',
        } as any,
        {
          id: `sec-${ts}-4`,
          type: 'stylist-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'care-concierge',
          scrollAnimation: 'none',
          title: 'Have a Specific Care Question?',
          description: 'Our certified gemologists and textile specialists are on standby to provide tailored care instructions for your exact piece.',
          ctaLabel: 'Message Atelier Concierge',
        } as any,
      ];

    case 'lookbook':
      return [
        {
          id: `sec-${ts}-1`,
          type: 'hero',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 0,
          paddingBottom: 0,
          sectionId: 'lookbook-hero',
          scrollAnimation: 'none',
          layout: 'centered',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
          backgroundVideo: '',
          backgroundColor: '#1E293B',
          gradientFrom: '#1E293B',
          gradientTo: '#0F172A',
          overlayColor: '#000000',
          overlayOpacity: 40,
          heading: 'Autumn / Winter Atelier Lookbook',
          headingSize: 42,
          subheading: 'A curated visual harmony of sculpted yellow gold jewelry layered over heavyweight cashmere silhouettes.',
          textAlign: 'center',
          textColor: '#ffffff',
          minHeight: 480,
          mobileImage: '',
          cta1Label: 'View Gallery',
          cta1Link: '#gallery',
          cta1Style: 'filled',
          cta1Color: '#ff6c2f',
          cta2Label: 'Shop The Looks',
          cta2Link: '/products',
          cta2Style: 'outline',
          cta2Color: '#ffffff',
        } as any,
        {
          id: `sec-${ts}-2`,
          type: 'category-grid',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 48,
          paddingBottom: 48,
          sectionId: 'lookbook-chapters',
          scrollAnimation: 'none',
          title: 'Collection Chapters',
          cat1Label: 'Statement Rings',
          cat2Label: 'Diamond Pendants',
          cat3Label: 'Ribbed Cardigans',
          cat4Label: 'Solid Bangles',
          cat5Label: 'Turtlenecks',
          cat6Label: 'Hoop Earrings',
          layout: 'grid',
          columns: 6,
        } as any,
        {
          id: `sec-${ts}-3`,
          type: 'featured-products',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 40,
          paddingBottom: 40,
          sectionId: 'lookbook-products',
          scrollAnimation: 'none',
          title: 'Runway Editorial Pieces',
          subtitle: 'Limited pieces handcrafted in small batches for the current season.',
          displayType: 'grid',
          columns: 4,
          productSource: 'best-sellers',
          productIds: [],
          maxProducts: 8,
          showPrice: true,
          showRating: true,
          showAddToCart: true,
          showDiscountBadge: true,
          backgroundColor: '#FAF6F0',
          viewAllLabel: 'Explore All Lookbook Styles',
          viewAllLink: '/products',
        } as any,
        {
          id: `sec-${ts}-4`,
          type: 'promo-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'lookbook-reserve',
          scrollAnimation: 'none',
          title: 'Reserve Runway Pieces in Advance',
          description: 'Each piece in this lookbook is limited to 50 handcrafted units globally. Pre-order now to secure allocation.',
          ctaLabel: 'Reserve Allocation',
          ctaLink: '/products',
        } as any,
      ];

    case 'membership':
      return [
        {
          id: `sec-${ts}-1`,
          type: 'hero',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 0,
          paddingBottom: 0,
          sectionId: 'membership-hero',
          scrollAnimation: 'none',
          layout: 'centered',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=80',
          backgroundVideo: '',
          backgroundColor: '#3D2817',
          gradientFrom: '#3D2817',
          gradientTo: '#1E293B',
          overlayColor: '#000000',
          overlayOpacity: 50,
          heading: 'Waveron Atelier Membership',
          headingSize: 42,
          subheading: 'Private previews, bespoke ring consultations, and exclusive allocations for our patrons.',
          textAlign: 'center',
          textColor: '#ffffff',
          minHeight: 460,
          mobileImage: '',
          cta1Label: 'Join Membership',
          cta1Link: '#join',
          cta1Style: 'filled',
          cta1Color: '#ff6c2f',
          cta2Label: 'Member Privileges',
          cta2Link: '#perks',
          cta2Style: 'outline',
          cta2Color: '#ffffff',
        } as any,
        {
          id: `sec-${ts}-2`,
          type: 'promo-cards',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'membership-perks',
          scrollAnimation: 'fade',
          card1Title: '48-Hour Priority Drop',
          card1Subtitle: 'Private Release Access',
          card1Badge: 'Priority',
          card1Bg: 'bg-[#FAF6F0]',
          card2Title: 'Personal Atelier Stylist',
          card2Subtitle: 'Direct WhatsApp Concierge',
          card2Badge: 'VIP',
          card2Bg: 'bg-[#EDE7F3]',
          card3Title: 'Bespoke Ring Sizing',
          card3Subtitle: 'Complimentary Precision Fit',
          card3Badge: 'Included',
          card3Bg: 'bg-[#E8F0E5]',
          card4Title: 'Annual Restoration',
          card4Subtitle: 'Full Ultrasonic Polish',
          card4Badge: 'Lifetime',
          card4Bg: 'bg-[#FCEFE3]',
        } as any,
        {
          id: `sec-${ts}-3`,
          type: 'testimonials',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 48,
          paddingBottom: 48,
          sectionId: 'membership-testimonials',
          scrollAnimation: 'none',
          title: 'Patron Experiences',
          displayType: 'grid',
          backgroundColor: '#ffffff',
          cardStyle: 'bordered',
          autoPlay: false,
          autoPlaySpeed: 5,
          items: [
            { id: '1', name: 'Victoria Sterling', company: 'Gold Tier Patron', text: 'Having a dedicated stylist assist me in coordinating custom emerald earrings with a cashmere turtleneck was truly second to none.', rating: 5, photo: '' },
            { id: '2', name: 'Jonathan Reid', company: 'Private Client', text: 'The priority access enabled me to acquire an extraordinary unheated sapphire ring before it went live to the public.', rating: 5, photo: '' },
          ],
        } as any,
        {
          id: `sec-${ts}-4`,
          type: 'stylist-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'membership-apply',
          scrollAnimation: 'none',
          title: 'Ready to Experience the Private Atelier?',
          description: 'Membership is complimentary for collectors with an active Waveron account. Connect with our concierge to activate your status.',
          ctaLabel: 'Activate VIP Status',
        } as any,
      ];

    default:
      // Generic custom page
      return [
        {
          id: `sec-${ts}-1`,
          type: 'hero',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 0,
          paddingBottom: 0,
          sectionId: `${pageSlug}-hero`,
          scrollAnimation: 'none',
          layout: 'centered',
          backgroundType: 'solid',
          backgroundImage: '',
          backgroundVideo: '',
          backgroundColor: '#3D2817',
          gradientFrom: '#3D2817',
          gradientTo: '#5C3A24',
          overlayColor: '#000000',
          overlayOpacity: 0,
          heading: pageSlug.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()),
          headingSize: 38,
          subheading: 'Welcome to this custom page. Click any element to edit content, styling, and layout.',
          textAlign: 'center',
          textColor: '#ffffff',
          minHeight: 340,
          mobileImage: '',
          cta1Label: 'Explore Products',
          cta1Link: '/products',
          cta1Style: 'filled',
          cta1Color: '#ff6c2f',
          cta2Label: 'Return Home',
          cta2Link: '/',
          cta2Style: 'outline',
          cta2Color: '#ffffff',
        } as any,
        {
          id: `sec-${ts}-2`,
          type: 'rich-content',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 48,
          paddingBottom: 48,
          sectionId: `${pageSlug}-content`,
          scrollAnimation: 'none',
          layout: 'full',
          backgroundColor: '#ffffff',
          backgroundImage: '',
          ctaLabel: 'Contact Us',
          ctaLink: '/membership',
          blocks: [
            {
              id: 'b1',
              content: '<h2 style="font-family: serif; font-size: 24px; font-weight: bold; margin-bottom: 16px;">About This Page</h2><p style="font-size: 16px; line-height: 1.7; color: #4b5563;">You can customize every section of this page using the visual builder on the left. Add new blocks, reorder sections, adjust padding, and publish changes directly to your live store.</p>',
              imageUrl: '',
              imageAlt: '',
            },
          ],
        } as any,
        {
          id: `sec-${ts}-3`,
          type: 'newsletter',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 56,
          paddingBottom: 56,
          sectionId: `${pageSlug}-newsletter`,
          scrollAnimation: 'none',
          heading: 'Stay In Touch with Waveron',
          subtext: 'Subscribe for private invitations and limited editions.',
          placeholder: 'Your email address...',
          buttonLabel: 'Subscribe',
          buttonColor: '#ff6c2f',
          layout: 'centered',
          backgroundType: 'solid',
          backgroundColor: '#FAF6F0',
          backgroundImage: '',
          successMessage: 'Thank you for subscribing.',
          integration: 'internal',
        } as any,
      ];
  }
}

export async function getPageDraft(pageSlug: string = 'home'): Promise<CmsSection[]> {
  const draftSlug = `${pageSlug}-draft`;
  try {
    const draftSections = await prisma.cmsSection.findMany({
      where: { pageSlug: draftSlug },
      orderBy: { sortOrder: 'asc' },
    });
    if (draftSections.length > 0) {
      return draftSections.map((s) => ({
        ...(typeof s.config === 'object' && s.config !== null ? (s.config as object) : {}),
        id: s.id,
        type: s.type as any,
        visible: s.isVisible,
      })) as CmsSection[];
    }
  } catch (e) {
    console.warn(`Could not fetch draft sections for ${pageSlug} from MySQL:`, e);
  }
  return getPagePublished(pageSlug);
}

export async function savePageDraft(pageSlug: string = 'home', sections: CmsSection[]) {
  const draftSlug = `${pageSlug}-draft`;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.cmsSection.deleteMany({ where: { pageSlug: draftSlug } });
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        await tx.cmsSection.create({
          data: {
            id: s.id || `draft-${pageSlug}-${Date.now()}-${i}`,
            pageSlug: draftSlug,
            type: s.type,
            title: (s as any).heading || (s as any).title || null,
            subtitle: (s as any).subheading || (s as any).subtitle || null,
            sortOrder: i,
            isVisible: s.visible !== false,
            config: s as any,
          },
        });
      }
    });
  } catch (err) {
    console.error(`Failed to save draft for ${pageSlug}:`, err);
  }
  return { success: true };
}

export async function publishPage(pageSlug: string = 'home') {
  const draft = await getPageDraft(pageSlug);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.cmsSection.deleteMany({ where: { pageSlug } });
      for (let i = 0; i < draft.length; i++) {
        const s = draft[i];
        await tx.cmsSection.create({
          data: {
            id: s.id || `sec-${pageSlug}-${Date.now()}-${i}`,
            pageSlug,
            type: s.type,
            title: (s as any).heading || (s as any).title || null,
            subtitle: (s as any).subheading || (s as any).subtitle || null,
            sortOrder: i,
            isVisible: s.visible !== false,
            config: s as any,
          },
        });
      }
    });
    const pathToRevalidate = pageSlug === 'home' ? '/' : `/${pageSlug}`;
    revalidatePath(pathToRevalidate);
    revalidatePath('/', 'layout');
  } catch (err) {
    console.error(`Failed to publish page ${pageSlug}:`, err);
  }
  return { success: true };
}

export async function getPagePublished(pageSlug: string = 'home'): Promise<CmsSection[]> {
  try {
    const sections = await prisma.cmsSection.findMany({
      where: { pageSlug },
      orderBy: { sortOrder: 'asc' },
    });
    if (sections.length > 0) {
      return sections.map((s) => ({
        ...(typeof s.config === 'object' && s.config !== null ? (s.config as object) : {}),
        id: s.id,
        type: s.type as any,
        visible: s.isVisible,
      })) as CmsSection[];
    }
  } catch (e) {
    console.warn(`Could not fetch published sections for ${pageSlug} from MySQL:`, e);
  }

  // Provide initial starter sections for standard pages if empty in database
  if (pageSlug === 'home') {
    const data = await getCmsData();
    if (data?.homepage?.published?.sections && data.homepage.published.sections.length > 0) {
      return data.homepage.published.sections;
    }
  }
  return await getDefaultSectionsForPage(pageSlug);
}

export async function getAllAvailablePages(): Promise<Array<{ slug: string; title: string; isSystem?: boolean }>> {
  const systemPages = [
    { slug: 'home', title: 'Homepage', isSystem: true },
    { slug: 'about', title: 'About Us', isSystem: true },
    { slug: 'care-guide', title: 'Care Guide', isSystem: true },
    { slug: 'lookbook', title: 'Lookbook', isSystem: true },
    { slug: 'membership', title: 'VIP Membership', isSystem: true },
  ];

  try {
    const customPages = await prisma.cmsPage.findMany({
      select: { slug: true, title: true },
    });
    const customSlugs = new Set(systemPages.map(p => p.slug));
    const extras = customPages
      .filter(p => !customSlugs.has(p.slug))
      .map(p => ({ slug: p.slug, title: p.title, isSystem: false }));
    return [...systemPages, ...extras];
  } catch (e) {
    return systemPages;
  }
}

// ─── Homepage draft/publish (Delegates to universal getPageDraft/publishPage) ──
export async function getHomepageDraft(): Promise<CmsSection[]> {
  return getPageDraft('home');
}

export async function saveHomepageDraft(sections: CmsSection[]) {
  return savePageDraft('home', sections);
}

export async function publishHomepage() {
  return publishPage('home');
}

export async function getHomepagePublished(): Promise<CmsSection[]> {
  return getPagePublished('home');
}

// ─── Legacy block-based layout (kept for backwards compat) ──────────────────
export async function getHomepageLayout(): Promise<string[]> {
  const sections = await getHomepagePublished();
  return sections.map(s => s.type);
}

export async function saveHomepageLayout(blocks: string[]) {
  return { success: true };
}

// ─── Static pages ──────────────────────────────────────────────────────────
export async function getCmsPages(): Promise<CmsPage[]> {
  try {
    const pages = await prisma.cmsPage.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    if (pages.length > 0) {
      return pages.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        content: p.content || '',
        status: (p.status as any) || 'Published',
        seoTitle: p.seoTitle || undefined,
        seoDescription: p.seoDescription || undefined,
        ogImage: p.ogImage || undefined,
        lastModified: p.updatedAt.toISOString(),
      }));
    }
  } catch (e) {
    console.warn('Could not fetch CMS pages from MySQL:', e);
  }
  const data = await getCmsData();
  return data.pages;
}

export async function getCmsPageBySlug(slug: string): Promise<CmsPage | undefined> {
  try {
    const page = await prisma.cmsPage.findUnique({
      where: { slug },
    });
    if (page) {
      return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content || '',
        status: (page.status as any) || 'Published',
        seoTitle: page.seoTitle || undefined,
        seoDescription: page.seoDescription || undefined,
        ogImage: page.ogImage || undefined,
        lastModified: page.updatedAt.toISOString(),
      };
    }
  } catch (e) {
    console.warn('Could not fetch CMS page by slug from MySQL:', e);
  }
  const data = await getCmsData();
  return data.pages.find(p => p.slug === slug);
}

export async function saveCmsPage(page: Omit<CmsPage, 'id' | 'lastModified'> & { id?: string }) {
  const pageId = page.id || `page-${Date.now()}`;
  try {
    await prisma.cmsPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content,
        status: page.status,
        seoTitle: page.seoTitle || null,
        seoDescription: page.seoDescription || null,
        ogImage: page.ogImage || null,
      },
      create: {
        id: pageId,
        slug: page.slug,
        title: page.title,
        content: page.content,
        status: page.status,
        seoTitle: page.seoTitle || null,
        seoDescription: page.seoDescription || null,
        ogImage: page.ogImage || null,
      },
    });
  } catch (e) {
    console.error('Failed to upsert CMS page in MySQL:', e);
  }

  // Also sync in-memory / fallback file
  const data = await getCmsData();
  const idx = data.pages.findIndex(p => p.slug === page.slug || (page.id && p.id === page.id));
  if (idx !== -1) {
    data.pages[idx] = { ...data.pages[idx], ...page, id: pageId, lastModified: new Date().toISOString() };
  } else {
    data.pages.push({ ...page, id: pageId, lastModified: new Date().toISOString() });
  }
  await saveCmsData(data);

  revalidatePath(`/${page.slug}`);
  revalidatePath('/admin/cms/pages');
  return { success: true };
}

export async function deleteCmsPage(id: string) {
  try {
    await prisma.cmsPage.delete({ where: { id } });
  } catch (err) {
    console.warn('Failed to delete CMS page from MySQL:', err);
  }
  const data = await getCmsData();
  data.pages = data.pages.filter(p => p.id !== id);
  await saveCmsData(data);
  revalidatePath('/admin/cms/pages');
  return { success: true };
}

// ─── Blog Posts ────────────────────────────────────────────────────────────
export async function getCmsPosts(): Promise<CmsPost[]> {
  try {
    const posts = await prisma.cmsPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (posts.length > 0) {
      return posts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content || '',
        excerpt: post.excerpt || '',
        status: (post.status as any) || 'Draft',
        author: post.author,
        categories: Array.isArray(post.categories) ? (post.categories as string[]) : [],
        tags: Array.isArray(post.tags) ? (post.tags as string[]) : [],
        featuredImage: post.featuredImage || '',
        seoTitle: post.seoTitle || undefined,
        seoDescription: post.seoDescription || undefined,
        publishDate: post.publishDate ? post.publishDate.toISOString() : undefined,
        lastModified: post.updatedAt.toISOString(),
      }));
    }
  } catch (e) {
    console.warn('Could not fetch CMS posts from MySQL:', e);
  }
  const data = await getCmsData();
  return data.posts || [];
}

export async function getCmsPostBySlug(slug: string): Promise<CmsPost | undefined> {
  try {
    const post = await prisma.cmsPost.findUnique({
      where: { slug },
    });
    if (post) {
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content || '',
        excerpt: post.excerpt || '',
        status: (post.status as any) || 'Draft',
        author: post.author,
        categories: Array.isArray(post.categories) ? (post.categories as string[]) : [],
        tags: Array.isArray(post.tags) ? (post.tags as string[]) : [],
        featuredImage: post.featuredImage || '',
        seoTitle: post.seoTitle || undefined,
        seoDescription: post.seoDescription || undefined,
        publishDate: post.publishDate ? post.publishDate.toISOString() : undefined,
        lastModified: post.updatedAt.toISOString(),
      };
    }
  } catch (e) {
    console.warn('Could not fetch CMS post by slug from MySQL:', e);
  }
  const data = await getCmsData();
  return (data.posts || []).find(p => p.slug === slug);
}

export async function saveCmsPost(post: Omit<CmsPost, 'id' | 'lastModified'> & { id?: string }) {
  const postId = post.id || `post-${Date.now()}`;
  try {
    await prisma.cmsPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt || null,
        content: post.content,
        status: post.status,
        author: post.author,
        featuredImage: post.featuredImage || null,
        categories: post.categories,
        tags: post.tags,
        publishDate: post.publishDate ? new Date(post.publishDate) : null,
      },
      create: {
        id: postId,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || null,
        content: post.content,
        status: post.status,
        author: post.author,
        featuredImage: post.featuredImage || null,
        categories: post.categories,
        tags: post.tags,
        publishDate: post.publishDate ? new Date(post.publishDate) : new Date(),
      },
    });
  } catch (e) {
    console.error('Failed to upsert CMS post in MySQL:', e);
  }

  const data = await getCmsData();
  if (!data.posts) data.posts = [];
  const idx = data.posts.findIndex(p => p.slug === post.slug || (post.id && p.id === post.id));
  if (idx !== -1) {
    data.posts[idx] = { ...data.posts[idx], ...post, id: postId, lastModified: new Date().toISOString() };
  } else {
    data.posts.push({ ...post, id: postId, lastModified: new Date().toISOString() });
  }
  await saveCmsData(data);

  revalidatePath(`/blog/${post.slug}`);
  revalidatePath('/admin/cms/blog');
  revalidatePath('/blog');
  return { success: true };
}

export async function deleteCmsPost(id: string) {
  try {
    await prisma.cmsPost.delete({ where: { id } });
  } catch (err) {
    console.warn('Failed to delete CMS post from MySQL:', err);
  }
  const data = await getCmsData();
  if (data.posts) data.posts = data.posts.filter(p => p.id !== id);
  await saveCmsData(data);
  revalidatePath('/admin/cms/blog');
  revalidatePath('/blog');
  return { success: true };
}

// ─── Mega Menu / Navigation ────────────────────────────────────────────────
export async function getCmsNavigation(): Promise<CmsMenuNode[]> {
  try {
    const setting = await prisma.cmsSetting.findUnique({
      where: { key: 'navigation' },
    });
    if (setting?.value && Array.isArray(setting.value)) {
      return setting.value as unknown as CmsMenuNode[];
    }
  } catch (e) {
    console.warn('Could not fetch navigation from MySQL:', e);
  }
  const data = await getCmsData();
  return (data.navigation || []) as CmsMenuNode[];
}

export async function saveCmsNavigation(navigation: any[]) {
  try {
    await prisma.cmsSetting.upsert({
      where: { key: 'navigation' },
      update: { value: navigation },
      create: { key: 'navigation', value: navigation },
    });
  } catch (e) {
    console.error('Failed to save navigation to MySQL:', e);
  }
  const data = await getCmsData();
  data.navigation = navigation;
  await saveCmsData(data);
  revalidatePath('/', 'layout');
  return { success: true };
}

// ─── SEO Settings ──────────────────────────────────────────────────────────
export async function getCmsSeoSettings(): Promise<CmsSeoSettings> {
  try {
    const setting = await prisma.cmsSetting.findUnique({
      where: { key: 'seo' },
    });
    if (setting?.value && typeof setting.value === 'object') {
      return setting.value as unknown as CmsSeoSettings;
    }
  } catch (e) {
    console.warn('Could not fetch SEO settings from MySQL:', e);
  }
  const data = await getCmsData();
  return (data.seo || { siteTitleTemplate: '', defaultMetaDescription: '', googleAnalyticsId: '', robotsTxt: '' }) as CmsSeoSettings;
}

export async function saveCmsSeoSettings(seo: any) {
  try {
    await prisma.cmsSetting.upsert({
      where: { key: 'seo' },
      update: { value: seo },
      create: { key: 'seo', value: seo },
    });
  } catch (e) {
    console.error('Failed to save SEO settings to MySQL:', e);
  }
  const data = await getCmsData();
  data.seo = seo;
  await saveCmsData(data);
  revalidatePath('/', 'layout');
  return { success: true };
}

// ─── Announcement Bar ──────────────────────────────────────────────────────
export async function getCmsAnnouncementBar(): Promise<CmsAnnouncementBar> {
  try {
    const setting = await prisma.cmsSetting.findUnique({
      where: { key: 'announcement-bar' },
    });
    if (setting?.value && typeof setting.value === 'object') {
      return setting.value as unknown as CmsAnnouncementBar;
    }
  } catch (e) {
    console.warn('Could not fetch announcement bar from MySQL:', e);
  }
  const data = await getCmsData();
  return (data.announcementBar || { visible: false, message: '', backgroundColor: '', textColor: '' }) as CmsAnnouncementBar;
}

export async function saveCmsAnnouncementBar(bar: any) {
  try {
    await prisma.cmsSetting.upsert({
      where: { key: 'announcement-bar' },
      update: { value: bar },
      create: { key: 'announcement-bar', value: bar },
    });
  } catch (e) {
    console.error('Failed to save announcement bar to MySQL:', e);
  }
  const data = await getCmsData();
  data.announcementBar = bar;
  await saveCmsData(data);
  revalidatePath('/', 'layout');
  return { success: true };
}

// ─── Footer Settings ───────────────────────────────────────────────────────
export async function getCmsFooter(): Promise<CmsFooterSettings> {
  try {
    const setting = await prisma.cmsSetting.findUnique({
      where: { key: 'footer' },
    });
    if (setting?.value && typeof setting.value === 'object') {
      return {
        ...DEFAULT_FOOTER_SETTINGS,
        ...(setting.value as object),
      } as CmsFooterSettings;
    }
  } catch (e) {
    console.warn('Could not fetch footer settings from MySQL:', e);
  }
  const data = await getCmsData();
  return (data.footer || DEFAULT_FOOTER_SETTINGS) as CmsFooterSettings;
}

export async function saveCmsFooter(footer: CmsFooterSettings) {
  try {
    await prisma.cmsSetting.upsert({
      where: { key: 'footer' },
      update: { value: footer },
      create: { key: 'footer', value: footer },
    });
  } catch (e) {
    console.error('Failed to save footer settings to MySQL:', e);
  }
  const data = await getCmsData();
  data.footer = footer;
  await saveCmsData(data);
  revalidatePath('/', 'layout');
  return { success: true };
}

// ─── Multi-Industry Templates & Starter Kits ────────────────────────────────
export async function getIndustryTemplates() {
  return [
    {
      id: 'hardware',
      name: 'Hardware, Tools & Industrial',
      industry: 'Tools, Building & DIY',
      icon: 'solar:hammer-and-wrench-bold',
      tagline: 'Heavy-duty power tools, construction fasteners, plumbing & professional trade supplies.',
      accentColor: '#FF6C2F',
      badge: 'Contractor Ready',
    },
    {
      id: 'electronics',
      name: 'Electronics, Tech & Computing',
      industry: 'Computers, Phones & Gadgets',
      icon: 'solar:laptop-minimalistic-bold',
      tagline: 'Laptops, mobile devices, audio gear, smart home appliances, and gaming hardware.',
      accentColor: '#3B82F6',
      badge: 'High Tech',
    },
    {
      id: 'fashion',
      name: 'Fashion, Apparel & Boutique',
      industry: 'Clothing, Footwear & Accessories',
      icon: 'solar:t-shirt-bold',
      tagline: 'Modern wardrobe essentials, premium outerwear, luxury fabrics, and seasonal collections.',
      accentColor: '#8B5A3C',
      badge: 'Apparel & Style',
    },
    {
      id: 'grocery',
      name: 'Supermarket, Grocery & Food',
      industry: 'Fresh Produce, Bakery & Pantry',
      icon: 'solar:cart-large-bold',
      tagline: 'Farm fresh fruits, organic vegetables, dairy, artisan baked goods, and pantry staples.',
      accentColor: '#16A34A',
      badge: 'Farm Fresh',
    },
    {
      id: 'general',
      name: 'General Merchandise & Department',
      industry: 'Multi-Department Retail',
      icon: 'solar:shop-2-bold',
      tagline: 'Versatile multi-category superstore for home goods, lifestyle, tools, and consumer essentials.',
      accentColor: '#2563EB',
      badge: 'All-in-One Store',
    },
    {
      id: 'jewelry',
      name: 'Fine Jewelry & Luxury Atelier',
      industry: 'Jewelry, Gems & Watches',
      icon: 'solar:gem-bold',
      tagline: 'Handcrafted 18k gold jewelry, conflict-free diamonds, and bespoke heirloom commissions.',
      accentColor: '#D4A574',
      badge: 'Luxury Artisan',
    },
  ];
}

export async function applyIndustryTemplate(pageSlug: string = 'home', templateId: string): Promise<CmsSection[]> {
  const ts = Date.now();
  let sections: CmsSection[] = [];

  switch (templateId) {
    case 'hardware':
      sections = [
        {
          id: `sec-${ts}-1`,
          type: 'hero',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 0,
          paddingBottom: 0,
          sectionId: 'hero',
          scrollAnimation: 'none',
          layout: 'centered',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1600&q=80',
          backgroundColor: '#1E293B',
          overlayColor: '#0F172A',
          overlayOpacity: 55,
          heading: 'Professional Tools & Heavy Duty Hardware',
          headingSize: 42,
          subheading: 'Search cordless drills, masonry fasteners, plumbing fixtures, and jobsite gear...',
          textAlign: 'center',
          textColor: '#FFFFFF',
          minHeight: 480,
          cta1Label: 'Shop Power Tools',
          cta1Link: '/products',
          cta1Style: 'filled',
          cta1Color: '#FF6C2F',
          cta2Label: 'Contractor Catalog',
          cta2Link: '/products',
          cta2Style: 'outline',
          cta2Color: '#FFFFFF',
        } as any,
        {
          id: `sec-${ts}-2`,
          type: 'promo-cards',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'guarantees',
          scrollAnimation: 'fade',
          card1Title: 'Jobsite Express Delivery',
          card1Subtitle: 'Direct to your work zone',
          card1Badge: 'Fast',
          card1Bg: 'bg-[#F1F5F9]',
          card2Title: 'Contractor Grade',
          card2Subtitle: 'Built for extreme job conditions',
          card2Badge: 'Pro',
          card2Bg: 'bg-[#FEF3C7]',
          card3Title: '5-Year Warranty',
          card3Subtitle: 'Official brand coverage',
          card3Badge: 'Guaranteed',
          card3Bg: 'bg-[#E0F2FE]',
          card4Title: 'Price Match Promise',
          card4Subtitle: 'Best contractor rates guaranteed',
          card4Badge: 'Value',
          card4Bg: 'bg-[#DCFCE7]',
        } as any,
        {
          id: `sec-${ts}-3`,
          type: 'category-grid',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 40,
          paddingBottom: 40,
          sectionId: 'categories',
          title: 'Shop by Trade & Department',
          cat1Label: 'Power Tools',
          cat2Label: 'Hand Tools',
          cat3Label: 'Building Materials',
          cat4Label: 'Plumbing & Pipes',
          cat5Label: 'Electrical & Lighting',
          cat6Label: 'Safety & Workwear',
          cat7Label: 'Paints & Finishes',
          cat8Label: 'Fasteners & Screws',
          cat9Label: 'Ladders & Scaffolding',
          cat10Label: 'Garden & Outdoor',
        } as any,
        {
          id: `sec-${ts}-4`,
          type: 'featured-products',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 48,
          paddingBottom: 48,
          sectionId: 'featured',
          title: 'Contractor Favorites & Best Sellers',
          subtitle: 'Tested and recommended by professional tradespeople across the country.',
          columns: 4,
          maxProducts: 8,
          showPrice: true,
          showRating: true,
          showAddToCart: true,
          showDiscountBadge: true,
          backgroundColor: '#FFFFFF',
        } as any,
        {
          id: `sec-${ts}-5`,
          type: 'promo-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'promo',
          title: 'Trade Pro Month: Save Up to 30% on Heavy Duty Tool Kits',
          description: 'Special bulk contractor discounts available on impact drivers, rotary hammers, and generator sets.',
          ctaLabel: 'View Contractor Specials',
          ctaLink: '/products',
        } as any,
        {
          id: `sec-${ts}-6`,
          type: 'stylist-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'consultation',
          title: 'Need Advice On Your Build or Installation?',
          description: 'Our licensed trade specialists provide technical product guidance, material takeoffs, and custom equipment sizing.',
          ctaLabel: 'Talk to a Trade Specialist',
        } as any,
        {
          id: `sec-${ts}-7`,
          type: 'seo-content',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 40,
          paddingBottom: 40,
          sectionId: 'guide',
          title1: 'Commercial Grade Tools & Building Materials',
          body1: 'We supply certified power tools, safety equipment, and structural materials to independent builders and commercial contractors.',
          title2: 'Battery & Power Tool Maintenance Guide',
          body2: 'Proper storage and cyclic charging extend brushless tool lifespan. Keep battery contacts clean and avoid sub-zero storage.',
          title3: 'Contractor Accounts & Tax-Exempt Ordering',
          body3: 'Sign up for a verified business account to unlock automated volume discounts, net-30 terms, and dedicated dispatch.',
        } as any,
      ];
      break;

    case 'electronics':
      sections = [
        {
          id: `sec-${ts}-1`,
          type: 'hero',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 0,
          paddingBottom: 0,
          sectionId: 'hero',
          scrollAnimation: 'none',
          layout: 'centered',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
          backgroundColor: '#0F172A',
          overlayColor: '#020617',
          overlayOpacity: 60,
          heading: 'Next-Generation Electronics & Computing',
          headingSize: 42,
          subheading: 'High-performance laptops, noise-cancelling headphones, 4K monitors, and smart tech.',
          textAlign: 'center',
          textColor: '#FFFFFF',
          minHeight: 480,
          cta1Label: 'Explore Devices',
          cta1Link: '/products',
          cta1Style: 'filled',
          cta1Color: '#3B82F6',
          cta2Label: 'New Releases',
          cta2Link: '/products',
          cta2Style: 'outline',
          cta2Color: '#FFFFFF',
        } as any,
        {
          id: `sec-${ts}-2`,
          type: 'promo-cards',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'guarantees',
          card1Title: 'Express Courier Shipping',
          card1Subtitle: 'Shockproof secure packaging',
          card1Badge: 'Fast',
          card1Bg: 'bg-[#EFF6FF]',
          card2Title: 'Official 2-Year Warranty',
          card2Subtitle: 'Genuine brand manufacturer cover',
          card2Badge: 'Official',
          card2Bg: 'bg-[#F0FDF4]',
          card3Title: '30-Day Money Back',
          card3Subtitle: 'Full return if not satisfied',
          card3Badge: 'Zero Risk',
          card3Bg: 'bg-[#FAF5FF]',
          card4Title: '24/7 Technical Support',
          card4Subtitle: 'Live setup & troubleshooting help',
          card4Badge: 'Always On',
          card4Bg: 'bg-[#FFF7ED]',
        } as any,
        {
          id: `sec-${ts}-3`,
          type: 'category-grid',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 40,
          paddingBottom: 40,
          sectionId: 'categories',
          title: 'Browse Electronics Categories',
          cat1Label: 'Laptops & PCs',
          cat2Label: 'Smartphones',
          cat3Label: 'Audio & Headphones',
          cat4Label: 'Gaming & Consoles',
          cat5Label: 'Smart Home',
          cat6Label: 'Wearables & Watches',
          cat7Label: 'Cameras & Drones',
          cat8Label: 'Monitors & Displays',
          cat9Label: 'Tablets & E-Readers',
          cat10Label: 'Cables & Power',
        } as any,
        {
          id: `sec-${ts}-4`,
          type: 'featured-products',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 48,
          paddingBottom: 48,
          sectionId: 'featured',
          title: 'Top Rated Tech & Best Sellers',
          subtitle: 'Engineered for speed, durability, and immersive experiences.',
          columns: 4,
          maxProducts: 8,
          showPrice: true,
          showRating: true,
          showAddToCart: true,
          showDiscountBadge: true,
          backgroundColor: '#FFFFFF',
        } as any,
        {
          id: `sec-${ts}-5`,
          type: 'promo-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'promo',
          title: 'Special Tech Drop: Up to 25% Off Workstation Laptops & Displays',
          description: 'Upgrade your productivity setup with high refresh rates and ultra-quiet cooling.',
          ctaLabel: 'Shop Tech Deals',
          ctaLink: '/products',
        } as any,
        {
          id: `sec-${ts}-6`,
          type: 'stylist-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'tech-support',
          title: 'Need Help Choosing the Right Specs?',
          description: 'Chat with our certified tech specialists to match processors, memory, and graphics to your workflow.',
          ctaLabel: 'Chat with Tech Specialist',
        } as any,
        {
          id: `sec-${ts}-7`,
          type: 'seo-content',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 40,
          paddingBottom: 40,
          sectionId: 'guide',
          title1: 'Genuine Hardware & Manufacturer Certifications',
          body1: 'Every device sold through our store comes with authentic regional warranties and brand-authorized servicing.',
          title2: 'Device Setup & Battery Optimization Guide',
          body2: 'Tips on initial calibration, firmware updates, and maintaining battery health over years of daily usage.',
          title3: 'Trade-In Program & Corporate Tech Fleets',
          body3: 'Upgrade existing equipment with trade-in credits or outfit your entire office with corporate bulk purchasing.',
        } as any,
      ];
      break;

    case 'grocery':
      sections = [
        {
          id: `sec-${ts}-1`,
          type: 'hero',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 0,
          paddingBottom: 0,
          sectionId: 'hero',
          scrollAnimation: 'none',
          layout: 'centered',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
          backgroundColor: '#14532D',
          overlayColor: '#052E16',
          overlayOpacity: 50,
          heading: 'Farm Fresh Produce & Daily Groceries',
          headingSize: 42,
          subheading: 'Locally grown organic fruits, vegetables, artisan bread, and fresh pantry goods.',
          textAlign: 'center',
          textColor: '#FFFFFF',
          minHeight: 460,
          cta1Label: 'Shop Fresh Now',
          cta1Link: '/products',
          cta1Style: 'filled',
          cta1Color: '#16A34A',
          cta2Label: 'Weekly Specials',
          cta2Link: '/products',
          cta2Style: 'outline',
          cta2Color: '#FFFFFF',
        } as any,
        {
          id: `sec-${ts}-2`,
          type: 'promo-cards',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'guarantees',
          card1Title: 'Same-Day Delivery',
          card1Subtitle: 'Delivered fresh within 2 hours',
          card1Badge: 'Fresh',
          card1Bg: 'bg-[#DCFCE7]',
          card2Title: '100% Certified Organic',
          card2Subtitle: 'Direct from vetted local growers',
          card2Badge: 'Pure',
          card2Bg: 'bg-[#FEF9C3]',
          card3Title: 'Cold-Chain Delivery',
          card3Subtitle: 'Refrigerated transit for dairy & greens',
          card3Badge: 'Chilled',
          card3Bg: 'bg-[#E0F2FE]',
          card4Title: 'Freshness Guarantee',
          card4Subtitle: 'If it is not fresh, we replace it free',
          card4Badge: 'Guaranteed',
          card4Bg: 'bg-[#F3E8FF]',
        } as any,
        {
          id: `sec-${ts}-3`,
          type: 'category-grid',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 40,
          paddingBottom: 40,
          sectionId: 'categories',
          title: 'Shop by Aisle & Department',
          cat1Label: 'Fresh Produce',
          cat2Label: 'Dairy & Eggs',
          cat3Label: 'Artisan Bakery',
          cat4Label: 'Meat & Seafood',
          cat5Label: 'Pantry Staples',
          cat6Label: 'Organic Snacks',
          cat7Label: 'Beverages & Juices',
          cat8Label: 'Breakfast Cereals',
          cat9Label: 'Oils & Condiments',
          cat10Label: 'Frozen Foods',
        } as any,
        {
          id: `sec-${ts}-4`,
          type: 'featured-products',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 48,
          paddingBottom: 48,
          sectionId: 'featured',
          title: 'Weekly Farm Fresh Specials',
          subtitle: 'Harvested this morning, packed with nutrition and natural flavor.',
          columns: 4,
          maxProducts: 8,
          showPrice: true,
          showRating: true,
          showAddToCart: true,
          showDiscountBadge: true,
          backgroundColor: '#FFFFFF',
        } as any,
        {
          id: `sec-${ts}-5`,
          type: 'promo-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'promo',
          title: 'Family Fresh Box: Save 20% on Weekly Seasonal Subscriptions',
          description: 'Custom organic fruit, veggie, and dairy bundles delivered directly to your doorstep each Monday.',
          ctaLabel: 'Order Fresh Box',
          ctaLink: '/products',
        } as any,
        {
          id: `sec-${ts}-6`,
          type: 'stylist-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'consultation',
          title: 'Need Help with Dietary or Meal Planning?',
          description: 'Our certified nutrition consultants help build customized grocery lists tailored to your health and family needs.',
          ctaLabel: 'Chat with Food Consultant',
        } as any,
      ];
      break;

    case 'general':
      sections = [
        {
          id: `sec-${ts}-1`,
          type: 'hero',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 0,
          paddingBottom: 0,
          sectionId: 'hero',
          scrollAnimation: 'none',
          layout: 'centered',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
          backgroundColor: '#1E293B',
          overlayColor: '#0F172A',
          overlayOpacity: 55,
          heading: 'Everything You Need, Delivered to Your Door',
          headingSize: 42,
          subheading: 'Discover thousands of trusted essentials across home, electronics, apparel, and lifestyle.',
          textAlign: 'center',
          textColor: '#FFFFFF',
          minHeight: 460,
          cta1Label: 'Start Shopping',
          cta1Link: '/products',
          cta1Style: 'filled',
          cta1Color: '#2563EB',
          cta2Label: 'Today Deals',
          cta2Link: '/products',
          cta2Style: 'outline',
          cta2Color: '#FFFFFF',
        } as any,
        {
          id: `sec-${ts}-2`,
          type: 'promo-cards',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'guarantees',
          card1Title: 'Fast Nationwide Delivery',
          card1Subtitle: 'Free delivery on orders over $50',
          card1Badge: 'Free',
          card1Bg: 'bg-[#F1F5F9]',
          card2Title: 'Buyer Protection',
          card2Subtitle: '30-day money back guarantee',
          card2Badge: 'Secure',
          card2Bg: 'bg-[#EFF6FF]',
          card3Title: 'Member Rewards',
          card3Subtitle: 'Earn cashback points on every order',
          card3Badge: 'Rewards',
          card3Bg: 'bg-[#FEF3C7]',
          card4Title: 'Dedicated Support',
          card4Subtitle: 'Fast friendly support team 24/7',
          card4Badge: '24/7',
          card4Bg: 'bg-[#DCFCE7]',
        } as any,
        {
          id: `sec-${ts}-3`,
          type: 'category-grid',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 40,
          paddingBottom: 40,
          sectionId: 'categories',
          title: 'Explore All Departments',
          cat1Label: 'Home & Kitchen',
          cat2Label: 'Electronics & Tech',
          cat3Label: 'Apparel & Shoes',
          cat4Label: 'Tools & Hardware',
          cat5Label: 'Sports & Outdoors',
          cat6Label: 'Beauty & Health',
          cat7Label: 'Kids & Toys',
          cat8Label: 'Automotive',
          cat9Label: 'Office Supplies',
          cat10Label: 'Pet Supplies',
        } as any,
        {
          id: `sec-${ts}-4`,
          type: 'featured-products',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 48,
          paddingBottom: 48,
          sectionId: 'featured',
          title: 'Trending & Popular Products',
          subtitle: 'Check out what other shoppers are loving this week.',
          columns: 4,
          maxProducts: 8,
          showPrice: true,
          showRating: true,
          showAddToCart: true,
          showDiscountBadge: true,
          backgroundColor: '#FFFFFF',
        } as any,
        {
          id: `sec-${ts}-5`,
          type: 'promo-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'promo',
          title: 'Super Saver Clearance: Save Up to 40% Across All Departments',
          description: 'Special stock clearance on top rated seasonal items. Limited inventory while supplies last.',
          ctaLabel: 'Shop Clearance Deals',
          ctaLink: '/products',
        } as any,
        {
          id: `sec-${ts}-6`,
          type: 'stylist-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'support',
          title: 'Need Help with Your Order or Sizing?',
          description: 'Our customer support team is available around the clock to help you find the right item and track your delivery.',
          ctaLabel: 'Contact Customer Support',
        } as any,
      ];
      break;

    case 'fashion':
      sections = [
        {
          id: `sec-${ts}-1`,
          type: 'hero',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 0,
          paddingBottom: 0,
          sectionId: 'hero',
          scrollAnimation: 'none',
          layout: 'centered',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
          backgroundColor: '#3D2817',
          overlayColor: '#000000',
          overlayOpacity: 45,
          heading: 'Curated Fashion & Everyday Essentials',
          headingSize: 42,
          subheading: 'Timeless silhouettes, ethical organic fabrics, and seasonal apparel for every occasion.',
          textAlign: 'center',
          textColor: '#FFFFFF',
          minHeight: 460,
          cta1Label: 'Shop Collection',
          cta1Link: '/products',
          cta1Style: 'filled',
          cta1Color: '#8B5A3C',
          cta2Label: 'New Arrivals',
          cta2Link: '/products',
          cta2Style: 'outline',
          cta2Color: '#FFFFFF',
        } as any,
        {
          id: `sec-${ts}-2`,
          type: 'promo-cards',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'guarantees',
          card1Title: 'Free Returns & Exchanges',
          card1Subtitle: 'Easy returns within 30 days',
          card1Badge: 'Easy',
          card1Bg: 'bg-[#FAF6F0]',
          card2Title: 'Ethically Crafted',
          card2Subtitle: 'Fair labor and sustainable fibers',
          card2Badge: 'Eco',
          card2Bg: 'bg-[#F5EFE6]',
          card3Title: 'Express Delivery',
          card3Subtitle: 'Carbon neutral parcel shipping',
          card3Badge: 'Fast',
          card3Bg: 'bg-[#E8F0E5]',
          card4Title: 'Garment Care Plan',
          card4Subtitle: 'Complimentary fabric care advice',
          card4Badge: 'Care',
          card4Bg: 'bg-[#EDE7F3]',
        } as any,
        {
          id: `sec-${ts}-3`,
          type: 'category-grid',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 40,
          paddingBottom: 40,
          sectionId: 'categories',
          title: 'Explore Collections',
          cat1Label: 'Jackets & Coats',
          cat2Label: 'Knitwear & Sweaters',
          cat3Label: 'Dresses & Skirts',
          cat4Label: 'Shirts & Blouses',
          cat5Label: 'Denim & Trousers',
          cat6Label: 'Footwear & Boots',
          cat7Label: 'Bags & Leather',
          cat8Label: 'Scarves & Hats',
          cat9Label: 'Loungewear',
          cat10Label: 'Sale Archive',
        } as any,
        {
          id: `sec-${ts}-4`,
          type: 'featured-products',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 48,
          paddingBottom: 48,
          sectionId: 'featured',
          title: 'Trending This Season',
          subtitle: 'Best selling staples designed for comfort and elegance.',
          columns: 4,
          maxProducts: 8,
          showPrice: true,
          showRating: true,
          showAddToCart: true,
          showDiscountBadge: true,
          backgroundColor: '#FFFFFF',
        } as any,
        {
          id: `sec-${ts}-5`,
          type: 'promo-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'promo',
          title: 'Seasonal Wardrobe Drop: Up to 25% Off Select Styles',
          description: 'Special offers on handcrafted outerwear, knitwear, and seasonal accessories.',
          ctaLabel: 'Shop Sale',
          ctaLink: '/products',
        } as any,
        {
          id: `sec-${ts}-6`,
          type: 'stylist-banner',
          visible: true,
          mobileHidden: false,
          desktopHidden: false,
          paddingTop: 32,
          paddingBottom: 32,
          sectionId: 'stylist',
          title: 'Complimentary Personal Stylist Consultation',
          description: 'Get matched with a stylist to build a versatile wardrobe capsule for your lifestyle.',
          ctaLabel: 'Book Stylist Chat',
        } as any,
      ];
      break;

    case 'jewelry':
    default:
      sections = await getDefaultSectionsForPage('home');
      break;
  }

  await savePageDraft(pageSlug, sections);
  return sections;
}
