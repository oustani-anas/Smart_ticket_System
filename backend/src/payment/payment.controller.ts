
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Req, Res, Headers } from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import Stripe from 'stripe';

@Controller('/payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService){}
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
    
    @UseGuards(AuthGuard('jwt')) // Protect this endpoint just like the other one
    @Post('/create-payment-intent')
    async createPaymentIntent(
      @Req() req: Request,
      @Body('eventId') eventId: string,
    ) {
      // The payload from the strategy is now on req.user
      // The user ID is in the 'sub' property.
      const userId = req.user['id']; // UPDATED from 'id' to 'sub'

      if (!userId) {
        throw new Error('User ID not found in token.');
      }
      
      return this.paymentService.createPaymentIntent(eventId, userId);
    }
    
    // Webhook for stripe 
    @Post('/webhook')
    async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ) {
    console.log("in the controller of webhook")
    const endpointSecret = process.env.WEB_HOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.paymentService['stripe'].webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      console.log("err = ", err);
      return { error: `Webhook Error: ${err}` };
    }

    await this.paymentService.handleWebhook(event);
  }
}
