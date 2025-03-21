
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule);
  const configservice = app.get(ConfigService);
  
  const config = new DocumentBuilder()
  .setTitle('Api')
  .setDescription('Api Documentation fo my app')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
	
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  await app.listen(configservice.get<number>('PORT'));

}
bootstrap();
