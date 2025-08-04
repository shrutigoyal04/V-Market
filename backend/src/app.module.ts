// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module'; // Corrected path
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module'; // Corrected path
import { ProductModule } from './modules/product/product.module'; // Corrected path
import { ShopkeeperModule } from './modules/shopkeeper/shopkeeper.module'; // Corrected path
import { ProductRequestModule } from './modules/product-request/product-request.module'; // Corrected path
import { ProductTransferHistoryModule } from './modules/product-transfer-history/product-transfer-history.module'; // Corrected path
import { NotificationModule } from './modules/notification/notification.module'; // Corrected path

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    ProductModule,
    ShopkeeperModule,
    ProductRequestModule,
    ProductTransferHistoryModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}