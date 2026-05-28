import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';
import { ProductType, ProductStatus } from './products/entities/product.entity';

async function bootstrap() {
  console.log('Seeding database...');
  const app = await NestFactory.createApplicationContext(AppModule);

  const categoriesService = app.get(CategoriesService);
  const productsService = app.get(ProductsService);

  // 1. Create Categories
  console.log('Creating Categories...');
  const electronics = await categoriesService.create({
    name: 'Electronics',
    slug: 'electronics',
    description: 'Gadgets and electronic devices',
  });

  const clothing = await categoriesService.create({
    name: 'Clothing',
    slug: 'clothing',
    description: 'Apparel and accessories',
  });

  const computers = await categoriesService.create({
    name: 'Computers',
    slug: 'computers',
    description: 'Laptops and desktops',
    parentId: electronics.id,
  });

  // 2. Create Products
  console.log('Creating Products...');
  
  // Electronics
  await productsService.create({
    title: 'MacBook Pro 16"',
    slug: 'macbook-pro-16',
    description: 'The ultimate pro notebook.',
    short_description: 'M3 Max, 36GB RAM, 1TB SSD',
    type: ProductType.SIMPLE,
    status: ProductStatus.ACTIVE,
    price: 3499.00,
    stock_quantity: 15,
    sku: 'APP-MBP-16',
    is_visible: true,
    categoryId: computers.id,
  });

  await productsService.create({
    title: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Industry leading noise canceling headphones.',
    short_description: 'Wireless Noise Canceling Headphones',
    type: ProductType.SIMPLE,
    status: ProductStatus.ACTIVE,
    price: 398.00,
    compare_at_price: 450.00,
    stock_quantity: 42,
    sku: 'SON-WH-XM5',
    is_visible: true,
    categoryId: electronics.id,
  });

  // Clothing
  await productsService.create({
    title: 'Minimalist Cotton T-Shirt',
    slug: 'minimalist-cotton-t-shirt',
    description: 'A comfortable, lightweight 100% cotton t-shirt.',
    short_description: 'Premium organic cotton',
    type: ProductType.VARIABLE,
    status: ProductStatus.ACTIVE,
    price: 25.00,
    stock_quantity: 100,
    sku: 'CLO-TEE-MIN',
    is_visible: true,
    categoryId: clothing.id,
  });

  await productsService.create({
    title: 'Heavyweight Hoodie',
    slug: 'heavyweight-hoodie',
    description: 'Stay warm with this 400gsm heavyweight hoodie.',
    short_description: 'Warm, cozy, and stylish',
    type: ProductType.VARIABLE,
    status: ProductStatus.ACTIVE,
    price: 65.00,
    stock_quantity: 50,
    sku: 'CLO-HD-HVY',
    is_visible: true,
    categoryId: clothing.id,
  });

  console.log('Database seeded successfully!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed!', err);
  process.exit(1);
});
