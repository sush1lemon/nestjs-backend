import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as userAgent from 'express-useragent';
import { UnauthorizedExceptionFilter } from './unauthorized-exception.filter';
import * as cookieParser from 'cookie-parser';
import configuration from './config/configuration';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(userAgent.express());
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors({
    origin: configuration().cors.origins,
    credentials: configuration().cors.credentials,
  });
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  await app.listen(configuration().port);
}

bootstrap();
