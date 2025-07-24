import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTransferHistory } from '../database/entities/product-transfer-history.entity';
import { ProductTransferHistoryService } from './product-transfer-history.service';
import { ProductTransferHistoryController } from './product-transfer-history.controller';
import { Product } from '../database/entities/product.entity';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductTransferHistory, Product, Shopkeeper]),
  ],
  providers: [ProductTransferHistoryService],
  controllers: [ProductTransferHistoryController],
  exports: [ProductTransferHistoryService], // Export if other modules might need to use this service
})
export class ProductTransferHistoryModule {}

