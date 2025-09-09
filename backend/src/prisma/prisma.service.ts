
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  async onModuleInit() {
    try {
      await this.$connect();
      // this.logger.log('✅ Connected to the database');
      console.log('Connected to database. ');
    } catch(error) {
      console.log('❌ Failed to connect to database ');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}