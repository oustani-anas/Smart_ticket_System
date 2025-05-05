
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async purchaseTicket(userId: string, type: string, expiration: Date) {
    return this.prisma.ticket.create({
      data: {
        type,
        expiration,
        userId,
        status: 'valid',
      },
    });
  }

  async validateTicket(ticketId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket || ticket.expiration < new Date()) {
      return { valid: false };
    }

    return { valid: true };
  }
}