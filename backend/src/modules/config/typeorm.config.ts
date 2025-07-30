import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { createTypeOrmOptions } from './typeorm-options';

config(); // load .env
const configService = new ConfigService();

export default new DataSource(createTypeOrmOptions(configService));
