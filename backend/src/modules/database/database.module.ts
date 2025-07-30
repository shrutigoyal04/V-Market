import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { createTypeOrmOptions } from '../config/typeorm-options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => createTypeOrmOptions(configService),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
