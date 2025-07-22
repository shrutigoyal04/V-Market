// backend/src/product-request/product-request.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRequestService } from './product-request.service';
import { ProductRequestController } from './product-request.controller';
import { ProductRequest } from '../database/entities/product-request.entity';
import { Product } from '../database/entities/product.entity';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for AuthGuard
import { ConfigModule } from '@nestjs/config'; // Needed for ConfigService in AuthModule if not already in AppModule

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRequest, Product, Shopkeeper]), // Register all entities used by the service
    AuthModule, // Import AuthModule to make AuthGuard available
    ConfigModule, // Needed for ConfigService in AuthModule if not already globally imported
  ],
  controllers: [ProductRequestController],
  providers: [ProductRequestService],
  exports: [ProductRequestService], // Export if other modules might need it
})
export class ProductRequestModule {}
