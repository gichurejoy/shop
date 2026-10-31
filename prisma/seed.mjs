import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed into MySQL (waveron_shop)...');

  const storePath = path.join(process.cwd(), 'data', 'store.json');
  const cmsPath = path.join(process.cwd(), 'cms-data.json');

  const storeData = fs.existsSync(storePath) ? JSON.parse(fs.readFileSync(storePath, 'utf8')) : {};
  const cmsData = fs.existsSync(cmsPath) ? JSON.parse(fs.readFileSync(cmsPath, 'utf8')) : {};

  // 1. Seed Users
  if (storeData.users && Array.isArray(storeData.users)) {
    console.log(`Seeding ${storeData.users.length} users...`);
    for (const u of storeData.users) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {
          name: u.name,
          role: u.role || 'customer',
          passwordHash: u.passwordHash,
          avatar: u.avatar || null,
          phone: u.phone || null,
        },
        create: {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || 'customer',
          passwordHash: u.passwordHash,
          avatar: u.avatar || null,
          phone: u.phone || null,
          createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        },
      });
    }
  }

  // 2. Seed Categories
  if (storeData.categories && Array.isArray(storeData.categories)) {
    console.log(`Seeding ${storeData.categories.length} categories...`);
    for (const c of storeData.categories) {
      await prisma.category.upsert({
        where: { slug: c.slug },
        update: {
          name: c.name,
          description: c.description || null,
          imageUrl: c.image_url || null,
          sortOrder: c.sort_order || 0,
        },
        create: {
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || null,
          imageUrl: c.image_url || null,
          sortOrder: c.sort_order || 0,
          createdAt: c.created_at ? new Date(c.created_at) : new Date(),
        },
      });
    }
  }

  // 3. Seed Products
  if (storeData.products && Array.isArray(storeData.products)) {
    console.log(`Seeding ${storeData.products.length} products...`);
    for (const p of storeData.products) {
      const categoryId = p.category?.id || (p.category_id ? String(p.category_id) : null);
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          title: p.title,
          description: p.description || null,
          shortDescription: p.short_description || null,
          type: p.type || 'simple',
          status: p.status || 'active',
          price: p.price,
          compareAtPrice: p.compare_at_price || null,
          stockQuantity: p.stock_quantity ?? 10,
          sku: p.sku || null,
          isVisible: p.is_visible !== false,
          categoryId: categoryId,
        },
        create: {
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description || null,
          shortDescription: p.short_description || null,
          type: p.type || 'simple',
          status: p.status || 'active',
          price: p.price,
          compareAtPrice: p.compare_at_price || null,
          stockQuantity: p.stock_quantity ?? 10,
          sku: p.sku || null,
          isVisible: p.is_visible !== false,
          categoryId: categoryId,
          createdAt: p.created_at ? new Date(p.created_at) : new Date(),
        },
      });
    }
  }

  // 4. Seed Coupons
  if (storeData.coupons && Array.isArray(storeData.coupons)) {
    console.log(`Seeding ${storeData.coupons.length} coupons...`);
    for (const coup of storeData.coupons) {
      await prisma.coupon.upsert({
        where: { code: coup.code },
        update: {
          discountType: coup.discountType,
          discountValue: coup.discountValue,
          minOrderAmount: coup.minOrderAmount || null,
          isActive: coup.isActive !== false,
          usageCount: coup.usageCount || 0,
          expiresAt: coup.expiresAt ? new Date(coup.expiresAt) : null,
        },
        create: {
          id: coup.id,
          code: coup.code,
          discountType: coup.discountType,
          discountValue: coup.discountValue,
          minOrderAmount: coup.minOrderAmount || null,
          isActive: coup.isActive !== false,
          usageCount: coup.usageCount || 0,
          expiresAt: coup.expiresAt ? new Date(coup.expiresAt) : null,
        },
      });
    }
  }

  // 5. Seed Orders & OrderItems
  if (storeData.orders && Array.isArray(storeData.orders)) {
    console.log(`Seeding ${storeData.orders.length} orders...`);
    for (const o of storeData.orders) {
      const order = await prisma.order.upsert({
        where: { orderNumber: o.orderNumber || o.id },
        update: {
          status: o.status,
          paymentStatus: o.paymentStatus,
          paymentMethod: o.paymentMethod || 'card',
          total: o.total,
        },
        create: {
          id: o.id,
          orderNumber: o.orderNumber || o.id,
          customerId: o.customerId || null,
          customerName: o.customerName || 'Customer',
          customerEmail: o.customerEmail || 'customer@example.com',
          customerPhone: o.customerPhone || null,
          subtotal: o.subtotal,
          tax: o.tax || 0,
          shippingFee: o.shippingFee || 0,
          discount: o.discount || 0,
          total: o.total,
          status: o.status || 'pending',
          paymentStatus: o.paymentStatus || 'paid',
          paymentMethod: o.paymentMethod || 'card',
          shippingMethod: o.shippingMethod || 'standard',
          shippingAddress: o.shippingAddress || {},
          trackingNumber: o.trackingNumber || null,
          timeline: o.timeline || [],
          createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
          updatedAt: o.updatedAt ? new Date(o.updatedAt) : new Date(),
        },
      });

      if (o.items && Array.isArray(o.items)) {
        await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
        for (const it of o.items) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: it.productId || null,
              name: it.name,
              price: it.price,
              quantity: it.quantity || 1,
              selectedSize: it.selectedSize || null,
              selectedColor: it.selectedColor || null,
              image: it.image || null,
            },
          });
        }
      }
    }
  }

  // 6. Seed CMS Pages
  if (cmsData.pages && Array.isArray(cmsData.pages)) {
    console.log(`Seeding ${cmsData.pages.length} CMS pages...`);
    for (const p of cmsData.pages) {
      await prisma.cmsPage.upsert({
        where: { slug: p.slug },
        update: {
          title: p.title,
          content: p.content || '',
          status: p.status || 'Published',
          seoTitle: p.seoTitle || null,
          seoDescription: p.seoDescription || null,
          ogImage: p.ogImage || null,
        },
        create: {
          id: p.id,
          slug: p.slug,
          title: p.title,
          content: p.content || '',
          status: p.status || 'Published',
          seoTitle: p.seoTitle || null,
          seoDescription: p.seoDescription || null,
          ogImage: p.ogImage || null,
        },
      });
    }
  }

  // 7. Seed CMS Posts
  if (cmsData.posts && Array.isArray(cmsData.posts)) {
    console.log(`Seeding ${cmsData.posts.length} CMS blog posts...`);
    for (const post of cmsData.posts) {
      await prisma.cmsPost.upsert({
        where: { slug: post.slug },
        update: {
          title: post.title,
          excerpt: post.excerpt || null,
          content: post.content || '',
          status: post.status || 'Published',
          author: post.author || 'Admin',
          featuredImage: post.featuredImage || null,
          categories: post.categories || [],
          tags: post.tags || [],
        },
        create: {
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt || null,
          content: post.content || '',
          status: post.status || 'Published',
          author: post.author || 'Admin',
          featuredImage: post.featuredImage || null,
          categories: post.categories || [],
          tags: post.tags || [],
          publishDate: post.publishDate ? new Date(post.publishDate) : new Date(),
        },
      });
    }
  }

  // 8. Seed CMS Sections (Homepage)
  const homeSections = cmsData.homepage?.draft?.sections || [];
  if (homeSections.length > 0) {
    console.log(`Seeding ${homeSections.length} CMS homepage sections...`);
    for (let i = 0; i < homeSections.length; i++) {
      const s = homeSections[i];
      await prisma.cmsSection.upsert({
        where: { id: s.id },
        update: {
          pageSlug: 'home',
          type: s.type,
          title: s.heading || s.title || null,
          sortOrder: i,
          isVisible: s.visible !== false,
          config: s,
        },
        create: {
          id: s.id,
          pageSlug: 'home',
          type: s.type,
          title: s.heading || s.title || null,
          sortOrder: i,
          isVisible: s.visible !== false,
          config: s,
        },
      });
    }
  }

  // 9. Seed CMS Settings (Navigation, SEO, Announcement Bar)
  if (cmsData.navigation) {
    await prisma.cmsSetting.upsert({
      where: { key: 'navigation' },
      update: { value: cmsData.navigation },
      create: { key: 'navigation', value: cmsData.navigation },
    });
  }
  if (cmsData.seo) {
    await prisma.cmsSetting.upsert({
      where: { key: 'seo' },
      update: { value: cmsData.seo },
      create: { key: 'seo', value: cmsData.seo },
    });
  }
  if (cmsData.announcementBar) {
    await prisma.cmsSetting.upsert({
      where: { key: 'announcement-bar' },
      update: { value: cmsData.announcementBar },
      create: { key: 'announcement-bar', value: cmsData.announcementBar },
    });
  }

  console.log('✅ MySQL Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
