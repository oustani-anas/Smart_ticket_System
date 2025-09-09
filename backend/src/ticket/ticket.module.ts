import { Module, forwardRef } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
    imports: [forwardRef(() => PaymentModule)],
    providers: [TicketService, PrismaService, PaymentService],
    controllers: [TicketController],
    exports: [TicketService]
})
export class TicketModule {}
