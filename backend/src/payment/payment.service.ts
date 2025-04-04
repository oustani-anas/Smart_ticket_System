
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class PaymentService {
    private stripe: Stripe;
    private readonly logger = new Logger(PaymentService.name)
    constructor(private configservice: ConfigService) {
        this.stripe = new Stripe(configservice.get<string>('Stripe_Secret'));
    }

    async createCheckoutSession(
        amount: number,
        currency: string,
        productId: string,
        quantity: number
    ): Promise<Stripe.Checkout.Session> {
        try {
            console.log('inside craete session stripe ');
            const session = await this.stripe.checkout.sessions.create({
              line_items: [
                {
                  price_data: {
                    currency: currency,
                    product_data: {
                      name: `Test Product`, // You can customize the product name as needed
                      // Additional product information can be added here
                    },
                    unit_amount: amount * 100, // Amount is in cents
                  },
                  quantity: quantity, // Specify the quantity of the product
                },
              ],
              mode: 'payment', // Set the mode to 'payment'
              success_url: `http://localhost:3000/success.html`, // Redirect URL on success
              cancel_url: `http://localhost:3000/cancel.html`, // Redirect URL on cancellation
              metadata: {
                // Pass any additional data here, such as user ID 
                // or product ID for handling in webhooks
                productId: productId,
              },
            });
      
            return session; // Return the created session
          } catch (error) {
            console.error('Error creating session:', error);
            throw new InternalServerErrorException(
              'Failed to create checkout session', // Handle errors gracefully
            );
        }
    }

    async handleWebhook(event: Stripe.Event) {
      switch (event.type) {
        case 'checkout.session.completed':
          this.logger.log('Checkout session completed:', event.data.object);
          // Implement your business logic for successful checkout here
          // For example:
          const session = event.data.object as Stripe.Checkout.Session;
          // You can retrieve relevant information from the session object
          const { payment_status, customer, metadata } = session;
  
          if (payment_status === 'paid') {
            // Handle successful payment, e.g., update order status in the database
            this.logger.log(`Payment was successful for customer: ${customer}`);
            // You might want to send an email or update your database here
          } else {
            this.logger.warn('Payment status is not successful:', payment_status);
          }
          break;
  
        case 'checkout.session.expired':
          this.logger.log('Checkout session expired:', event.data.object);
          // Handle session expiration (e.g., notify the user or update the database)
          break;
  
        default:
          this.logger.warn(`Unhandled event type ${event.type}`);
          break;
      }
    }
}
