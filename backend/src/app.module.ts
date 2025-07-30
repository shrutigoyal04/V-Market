import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { ProductRequestModule } from './modules/product-request/product-request.module';
import { ShopkeeperModule } from './modules/shopkeeper/shopkeeper.module';
import { ProductTransferHistoryModule } from './modules/product-transfer-history/product-transfer-history.module'; // Import new module

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ShopkeeperModule,
    ProductModule,
    ProductRequestModule,
    ProductTransferHistoryModule, // Add the new module here
  ],
})
export class AppModule {}
