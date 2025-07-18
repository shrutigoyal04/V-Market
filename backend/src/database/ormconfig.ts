import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { config } from 'dotenv';

// Load .env file
config();

// Create ConfigService instance manually
const configService = new ConfigService();

const options: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [path.join(__dirname, 'entities', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
  ssl: configService.get('NODE_ENV') === 'production',
  logging: configService.get('DB_LOGGING')?.split(','),
};

export default new DataSource(options);