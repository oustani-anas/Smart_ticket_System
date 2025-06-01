
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Req, Res, Headers } from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import Stripe from 'stripe';

@Controller('/payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService){}
    
    /*@Post('/create-checkout-session')
    async CreateCheckoutSession(@Body() body :{
        amount: number, 
        currency: string,
        productId: string,
        quantity: number }): Promise<Stripe.Checkout.Session> 
    {
        const { amount, currency, productId, quantity } = body;
        console.log("inside sesion endpoint ")
        return this.paymentService.createCheckoutSession(amount, currency, productId, quantity);
    }*/

        @UseGuards(AuthGuard('jwt'))
        @Post('/create-checkout-session')
        async createCheckoutSession(
          @Req() req: Request,
          @Body('eventId') eventId: string,
        ) {
          console.log("inside the create session endpoints");
          console.log(`eventid : ${eventId}`);
          console.log("req.user: ", req.user);
          const userId = req.user['id']; // extracted from decoded JWT
          return this.paymentService.createCheckoutSession(eventId, userId);
        }
    

    // Webhook for stripe 

    @Post('/webhook')
    async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = process.env.WEB_HOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.paymentService['stripe'].webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      // return { error: `Webhook Error: ${err.message}` };
    }

    await this.paymentService.handleWebhook(event);
  }
}
