import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('/kimikast-api');
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5555', 'https://w01f-server.ru:8080'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.disable('x-powered-by');

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
