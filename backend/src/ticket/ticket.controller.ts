
// ticket.controller.ts
import { Controller, Post, Body, Param, Get, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from 'src/payment/payment.service';
import { Response, Request } from 'express';


@Controller('/ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly paymentService: PaymentService,
    ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/my-tickets')
  async getMyTickets(@Req() req: Request) {
    console.log("user = ", req.user);
    const userId = req.user['id'] ;
    console.log("userId = ", userId);
    return this.ticketService.getMyTickets(userId);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post('/purchase')
  async purchaseTicket(
    @Body('userId') userId: string,
    @Body('type') type: string,
    @Body('expiration') expiration: Date,
  ) {
    console.log("recieved body: ", userId, type, expiration);
    // return this.ticketService.purchaseTicket(userId, type, expiration);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/validate')
  async validateTicket(@Param('id') ticketId: string) {
    return this.ticketService.validateTicket(ticketId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/confirm-payment')
  @UseGuards(AuthGuard('jwt'))
  async ConfirmPayment(@Req() req: Request, @Body('sessionId') sessionId: string) {
    const session = await this.paymentService.getSession(sessionId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':ticketId/download')
  async downloadTicket(
    @Param('ticketId') ticketId: string, 
    @Res() res: Response,
    @Req() req: Request ) {
    
    const userId = req.user['id'];
    
    const pdfBuffer = await this.ticketService.getTicketPdf(ticketId, userId);

    if (!pdfBuffer) {
      throw new NotFoundException('Ticket not found or could not generate PDF');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ticket-${ticketId}.pdf"`,
    });
    res.send(pdfBuffer);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/ticket-id/:sessionId')
  async getTicketIdFromSession(@Param('sessionId') sessionId: string) {
  console.log("inside the ticket getting id ");
  try {
    const ticketId = await this.ticketService.getTicketIdBySessionId(sessionId);
    return { ticketId };
  } catch (error) {
    throw new NotFoundException(error);
  }
}

  

}