
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

dotenv.config();

async function bootstrap()
{

  const server = express();

  // 👇 Required for Stripe Webhook Signature Validation
  server.use(
    '/payment/webhook',
    express.raw({ type: 'application/json' }) 
  );

  const app = await NestFactory.create(AppModule, {rawBody: true});
  const configservice = app.get(ConfigService);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Strips unwanted fields
      forbidNonWhitelisted: true, // Throws on extra fields
      transform: true,          // Automatically transforms payloads to DTO instances
    }),
  );
  
  app.use(cookieParser());
  
  const config = new DocumentBuilder()
  .setTitle('Api')
  .setDescription('Api Documentation fo my app')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
	
  const corsOrigins = (configservice.get<string>('CORS_ORIGINS') || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim());
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  
  await app.listen(configservice.get<number>('PORT'));

}

bootstrap();
