import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopkeeperService } from './shopkeeper.service';
import { ShopkeeperController } from './shopkeeper.controller';
import { Shopkeeper } from '../database/entities/shopkeeper.entity'; // Adjust path if needed

@Module({
  imports: [
    TypeOrmModule.forFeature([Shopkeeper]), // Register Shopkeeper entity for this module
  ],
  controllers: [ShopkeeperController], // Register the new controller
  providers: [ShopkeeperService], // Register the new service
  exports: [ShopkeeperService, TypeOrmModule], // Export service if needed by other modules
})
export class ShopkeeperModule {}
