import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getOverviewStats() {
    const totalProducts = await this.productRepository.count();
    const totalCategories = await this.categoryRepository.count();
    
    // In a real app, these would come from an Orders table
    const totalRevenue = 45231.89;
    const subscriptions = 2350;
    const sales = 12234;
    const activeNow = 573;

    return {
      totalProducts,
      totalCategories,
      revenue: totalRevenue,
      subscriptions,
      sales,
      activeNow
    };
  }
}
