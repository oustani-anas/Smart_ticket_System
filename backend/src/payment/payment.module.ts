import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TicketService } from 'src/ticket/ticket.service';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
  imports: [forwardRef(() => TicketModule)],
  providers: [PaymentService, PrismaService, TicketService],
  controllers: [PaymentController],
  exports: [TicketService]
})
export class PaymentModule {}
