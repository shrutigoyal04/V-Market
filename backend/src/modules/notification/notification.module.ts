// backend/src/modules/notification/notification.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../database/entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';
import { ProductRequest } from '../database/entities/product-request.entity';
import { ProductTransferHistory } from '../database/entities/product-transfer-history.entity';
import { Product } from '../database/entities/product.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductRequestModule } from '../product-request/product-request.module';
import { JwtModule } from '@nestjs/jwt'; // <--- Import JwtModule
import { ConfigService } from '@nestjs/config'; // <--- Import ConfigService

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Shopkeeper, ProductRequest, ProductTransferHistory, Product]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProductRequestModule),
    // Configure JwtModule to be available for NotificationGateway
    JwtModule.registerAsync({ // <--- Add JwtModule configuration
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // Match your token expiry
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
