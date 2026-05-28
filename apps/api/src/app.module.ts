import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dev.sqlite',
      autoLoadEntities: true,
      synchronize: true, // Auto-create tables (good for dev)
    }),
    ProductsModule, 
    CategoriesModule, DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
