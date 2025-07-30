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
import { ProductTransferHistory } from '../database/entities/product-transfer-history.entity'; // Import new entity

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRequest, Product, Shopkeeper, ProductTransferHistory]), // Register new entity
    AuthModule,
    ConfigModule,
  ],
  controllers: [ProductRequestController],
  providers: [ProductRequestService],
  exports: [ProductRequestService],
})
export class ProductRequestModule {}
