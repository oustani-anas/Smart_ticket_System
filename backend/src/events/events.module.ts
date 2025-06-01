import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  providers: [EventService, PrismaService],
  controllers: [EventController]
})
export class EventsModule {}
