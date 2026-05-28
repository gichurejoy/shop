import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  VIEW_360 = '360_view'
}

@Entity('product_media')
export class ProductMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ enum: MediaType, default: MediaType.IMAGE })
  type: MediaType;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ nullable: true })
  alt_text: string;

  @ManyToOne(() => Product, (product) => product.media, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  created_at: Date;
}
