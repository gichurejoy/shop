import { Entity, Column, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
@Tree("closure-table")
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  banner_url: string;

  // SEO Fields
  @Column({ nullable: true })
  seo_title: string;

  @Column({ nullable: true })
  seo_meta_description: string;

  // Ordering
  @Column({ default: 0 })
  sort_order: number;

  // Nested Category Tree
  @TreeParent()
  parent: Category | null;

  @TreeChildren()
  children: Category[];

  // Relations
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
