import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductMedia } from './entities/product-media.entity';
import { ProductDigitalInfo } from './entities/product-digital.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { categoryId, variants, media, digital_info, ...productData } = createProductDto as any;
      
      const product = this.productRepository.create(productData) as Product;

      if (categoryId) {
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) throw new NotFoundException(`Category #${categoryId} not found`);
        product.category = category;
      }

      const savedProduct = await queryRunner.manager.save(product) as Product;

      if (variants && variants.length > 0) {
        const variantEntities = variants.map(v => ({ ...v, product: savedProduct }));
        await queryRunner.manager.save(ProductVariant, variantEntities);
      }

      if (media && media.length > 0) {
        const mediaEntities = media.map(m => ({ ...m, product: savedProduct }));
        await queryRunner.manager.save(ProductMedia, mediaEntities);
      }

      if (digital_info) {
        const digitalEntity = queryRunner.manager.create(ProductDigitalInfo, { ...digital_info, product: savedProduct });
        await queryRunner.manager.save(digitalEntity);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedProduct.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ 
      relations: ['category', 'variants', 'media', 'digital_info'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id }, 
      relations: ['category', 'variants', 'media', 'digital_info'] 
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryId, variants, media, digital_info, ...productData } = updateProductDto as any;

    Object.assign(product, productData);

    if (categoryId !== undefined) {
      if (categoryId === null) {
        product.category = null;
      } else {
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) throw new NotFoundException(`Category #${categoryId} not found`);
        product.category = category;
      }
    }

    // Advanced updates for variants/media would go here (complex diffing)
    // For now, simple save for the product itself
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async duplicate(id: string): Promise<Product> {
    const original = await this.findOne(id);
    const { id: _, created_at: __, updated_at: ___, slug, title, ...data } = original as any;
    
    return this.create({
      ...data,
      title: `${title} (Copy)`,
      slug: `${slug}-copy-${Date.now()}`,
      categoryId: original.category?.id
    });
  }
}
