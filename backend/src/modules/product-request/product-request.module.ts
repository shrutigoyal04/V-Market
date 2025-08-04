// backend/src/modules/product-request/product-request.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRequestService } from './product-request.service';
import { ProductRequestController } from './product-request.controller';
import { ProductRequest } from '../database/entities/product-request.entity';
import { Product } from '../database/entities/product.entity';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';
import { ProductTransferHistory } from '../database/entities/product-transfer-history.entity';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module'; // Import NotificationModule

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRequest, Product, Shopkeeper, ProductTransferHistory]),
    forwardRef(() => AuthModule),
    forwardRef(() => NotificationModule), // <--- THIS SHOULD BE PRESENT
  ],
  controllers: [ProductRequestController],
  providers: [ProductRequestService],
  exports: [ProductRequestService],
})
export class ProductRequestModule {}
