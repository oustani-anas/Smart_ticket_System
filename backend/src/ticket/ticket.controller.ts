// ticket.controller.ts
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('/purchase')
  async purchaseTicket(
    @Body('userId') userId: string,
    @Body('type') type: string,
    @Body('expiration') expiration: Date,
  ) {
    console.log("recieved body: ", userId, type, expiration);
    // return this.ticketService.purchaseTicket(userId, type, expiration);
  }

  @Get(':id/validate')
  async validateTicket(@Param('id') ticketId: string) {
    return this.ticketService.validateTicket(ticketId);
  }
}