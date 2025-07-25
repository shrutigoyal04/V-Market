import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from '../database/entities/product.entity';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';
import { ProductRequest } from '../database/entities/product-request.entity'; // Import ProductRequest
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for AuthGuard

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Shopkeeper, ProductRequest]), // Add ProductRequest here
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
