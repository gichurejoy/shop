export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  banner_url?: string;
  seo_title?: string;
  seo_meta_description?: string;
  sort_order: number;
  parent?: ICategory;
  children?: ICategory[];
  created_at: string | Date;
  updated_at: string | Date;
}
