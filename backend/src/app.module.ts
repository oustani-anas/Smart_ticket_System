
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TicketModule } from './ticket/ticket.module';
import { PaymentModule } from './payment/payment.module';
import { EventsModule } from './events/events.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    AdminModule, 
    UserModule, 
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TicketModule,
    PaymentModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

//export class AppModule {}
export class AppModule {}
