
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AdminController } from './admin/admin.controller';
import { UserService } from './user/user.service';
import { TicketModule } from './ticket/ticket.module';
import { PaymentModule } from './payment/payment.module';


@Module({
  imports: [
    AdminModule, 
    UserModule, 
    AuthModule, 
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TicketModule,
    PaymentModule
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
