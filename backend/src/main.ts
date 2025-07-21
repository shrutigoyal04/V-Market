import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  
  app.enableCors({
    origin: frontendUrl,
    credentials: true,  // Allows cookies and auth headers to be sent.
  });

  await app.listen(3001);
}
bootstrap();
