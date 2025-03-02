
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule);
  const configservice = app.get(ConfigService);
  await app.listen(configservice.get<number>('PORT'));

}
bootstrap();

