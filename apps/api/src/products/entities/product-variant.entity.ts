import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g. "Small / Red"

  @Column({ unique: true, nullable: true })
  sku: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  compare_at_price: number;

  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ nullable: true })
  barcode: string;

  @Column({ type: 'simple-json', nullable: true })
  attributes: Record<string, string>; // e.g. { size: "S", color: "Red" }

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
