import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ProductRequestModule } from './product-request/product-request.module';
import { ShopkeeperModule } from './shopkeeper/shopkeeper.module';

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
  ],
})
export class AppModule {}
