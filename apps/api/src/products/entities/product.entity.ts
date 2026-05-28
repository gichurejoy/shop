import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductMedia } from './product-media.entity';
import { ProductDigitalInfo } from './product-digital.entity';

export enum ProductType {
  SIMPLE = 'simple',
  VARIABLE = 'variable',
  DIGITAL = 'digital',
  BUNDLE = 'bundle',
  SUBSCRIPTION = 'subscription'
}

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  short_description: string;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.SIMPLE })
  type: ProductType;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  // Pricing
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  compare_at_price: number;

  // Inventory
  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  barcode: string;

  // SEO
  @Column({ nullable: true })
  seo_title: string;

  @Column({ type: 'text', nullable: true })
  seo_meta_description: string;

  // Metadata
  @Column({ nullable: true })
  publish_at: Date;

  @Column({ default: true })
  is_visible: boolean;

  // Relations
  @ManyToOne(() => Category, (category) => category.products, { nullable: true, onDelete: 'SET NULL' })
  category: Category | null;

  @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
  variants: ProductVariant[];

  @OneToMany(() => ProductMedia, (media) => media.product, { cascade: true })
  media: ProductMedia[];

  @OneToOne(() => ProductDigitalInfo, (digital) => digital.product, { cascade: true })
  digital_info: ProductDigitalInfo;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
