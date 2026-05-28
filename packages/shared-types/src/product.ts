import { ICategory } from './category';

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

export interface IProduct {
  id: string;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  type: ProductType;
  status: ProductStatus;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  sku?: string;
  barcode?: string;
  seo_title?: string;
  seo_meta_description?: string;
  publish_at?: string | Date;
  is_visible: boolean;
  category?: ICategory;
  created_at: string | Date;
  updated_at: string | Date;
}
