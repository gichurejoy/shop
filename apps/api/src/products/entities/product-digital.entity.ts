import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_digital_info')
export class ProductDigitalInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  file_url: string;

  @Column({ default: false })
  is_license_required: boolean;

  @Column({ type: 'text', nullable: true })
  license_keys: string; // Stored as comma-separated or JSON for now

  @OneToOne(() => Product, (product) => product.digital_info, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;
}
