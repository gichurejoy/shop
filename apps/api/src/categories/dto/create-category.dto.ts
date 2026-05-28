import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  banner_url?: string;

  @IsOptional()
  @IsString()
  seo_title?: string;

  @IsOptional()
  @IsString()
  seo_meta_description?: string;

  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
