
import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Res, Headers } from '@nestjs/common';
import { Request, Response } from 'express'
import Stripe from 'stripe';

@Controller('/payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService){}
    @Post('/create-checkout-session')
    async CreateCheckoutSession(@Body() body :{
        amount: number, 
        currency: string,
        productId: string,
        quantity: number }): Promise<Stripe.Checkout.Session> 
    {
        const { amount, currency, productId, quantity } = body;
        console.log("inside sesion endpoint ")
        return this.paymentService.createCheckoutSession(amount, currency, productId, quantity);
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
        req.rawBody,
        sig,
        endpointSecret,
      );
    } catch (err) {
      return { error: `Webhook Error: ${err.message}` };
    }

    await this.paymentService.handleWebhook(event);
  }

}
