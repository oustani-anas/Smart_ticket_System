
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
    constructor(private prisma: PrismaService) {}

    async createEvent(data: any) {
        console.log("data: ", data);
        return this.prisma.event.create({ data });
    }

    async getAllEvents() {
        const events = await this.prisma.event.findMany({
            where: {
              isActive: true,
              // startTime: { gte: new Date() }, this is necessary for the events upcoming
            },
            orderBy: { startTime: 'asc' },
          });
        
          return {
            count: events.length,
            events,
          };
    }
}
