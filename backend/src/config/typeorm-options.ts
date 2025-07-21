import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

export function createTypeOrmOptions(configService: ConfigService): DataSourceOptions {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [path.join(__dirname, '..', 'database', 'entities', '*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
    ssl: configService.get('NODE_ENV') === 'production',
    logging: configService.get('DB_LOGGING')?.split(','),
  };
}
