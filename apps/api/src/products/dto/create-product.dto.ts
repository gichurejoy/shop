import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsUUID } from 'class-validator';
import { ProductType, ProductStatus } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  short_description?: string;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  compare_at_price?: number;

  @IsOptional()
  @IsNumber()
  stock_quantity?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  seo_title?: string;

  @IsOptional()
  @IsString()
  seo_meta_description?: string;

  @IsOptional()
  @IsBoolean()
  is_visible?: boolean;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
