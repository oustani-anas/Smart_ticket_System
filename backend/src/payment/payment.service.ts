
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import Stripe from 'stripe';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketService } from 'src/ticket/ticket.service';


@Injectable()
export class PaymentService {
    private stripe: Stripe;
    private readonly logger = new Logger(PaymentService.name)
    
    constructor(
      private readonly configservice: ConfigService,
      private readonly prisma: PrismaService,
      @Inject(forwardRef(() => TicketService))
      private readonly ticketservise: TicketService
    ) {
        this.stripe = new Stripe(configservice.get<string>('Stripe_Secret'));
    }
    async createCheckoutSession(eventId: string, userId: string): Promise<{ checkoutUrl: string }> {
          try {
            const event = await this.prisma.event.findUnique({ where: { id: eventId } });
      
            if (!event) {
              throw new InternalServerErrorException('Event not found');
            }
            console.log("inside the creation of session of the payment");
            console.log("Creating Stripe session with metadata:");
            console.log("eventId:", eventId);
            console.log("userId:", userId);
            
            const session = await this.stripe.checkout.sessions.create({
              line_items: [
                {
                  price_data: {
                    currency: 'usd',
                    product_data: {
                      name: event.name,
                    },
                    unit_amount: Math.round(event.price * 100), // cents
                  },
                  quantity: 1,
                },
              ],
              mode: 'payment',
              // success_url: `http://localhost:5173/paymentSuccess`,
              success_url: `http://localhost:3000/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `http://localhost:3000/events`,
              metadata: {
                eventId,
                userId,
              },
            });
      
            return { checkoutUrl: session.url };
          } catch (error) {
            this.logger.error(`Stripe session creation failed: ${(error as Error).message}`);

            throw new InternalServerErrorException('Could not create checkout session');
          }
        }

      async getSession(sessionId: string) {
        return this.stripe.checkout.sessions.retrieve(sessionId);
      }

    // this one for mobile app 
    async createPaymentIntent(eventId: string, userId: string): Promise<{ clientSecret: string }> {
      try {
        // 1. Get the event from the database to ensure the price is correct
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
  
        if (!event) {
          throw new InternalServerErrorException('Event not found');
        }

        // 2. Create a PaymentIntent on Stripe's servers
        console.log("inside the payment intent creation");  
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: Math.round(event.price * 100), // Amount in cents
          currency: 'usd', // Or your desired currency
          automatic_payment_methods: {
            enabled: true, // Let Stripe manage payment methods (cards, Google Pay, etc.)
          },
          // 3. IMPORTANT: Add the same metadata so your webhook can create the ticket!
          metadata: {
            eventId,
            userId,
          },
        });
        // 4. Return the client_secret to the Flutter app
        return { clientSecret: paymentIntent.client_secret };

      } catch (error) {
        this.logger.error(`Stripe Payment Intent creation failed: ${(error as Error).message}`);
        throw new InternalServerErrorException('Could not initiate payment');
      }
    }

    
  async handleWebhook(event: Stripe.Event) {
  this.logger.log(`Received Stripe event: ${event.type}`);

  switch (event.type) {
    // This case is for your web app
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === 'paid') {
        // Call a helper function to create the ticket
        await this.createTicketFromWebhook(session.metadata);
      }
      break;
    }

    // ====================================================================
    // NEW CASE FOR YOUR FLUTTER APP
    // ====================================================================
    case 'payment_intent.succeeded': {
      console.log("inside the flutter webhook handler ");
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // We pass the same metadata to our helper function
      await this.createTicketFromWebhook(paymentIntent.metadata);
      break;
    }

    default:
      this.logger.warn(`Unhandled event type: ${event.type}`);
      break;
  }
}

// ====================================================================
// NEW HELPER METHOD TO AVOID CODE DUPLICATION
// ====================================================================
private async createTicketFromWebhook(metadata: Stripe.Metadata) {
  console.log("=== Webhook createTicketFromWebhook ===");
  console.log("Received metadata:", metadata);
  console.log("metadata.userId:", metadata.userId);
  console.log("metadata.eventId:", metadata.eventId);
  
  const userId = metadata.userId;
  const eventId = metadata.eventId;

  if (!userId || !eventId) {
    this.logger.error('Webhook metadata missing userId or eventId');
    console.log("Missing data - userId:", userId, "eventId:", eventId);
    return;
  }
  
  // Check if ticket already exists (avoid duplicates)
  const existingTicket = await this.prisma.ticket.findFirst({
    where: { userId, eventId },
  });

  if (existingTicket) {
    this.logger.warn(`Ticket already exists for user ${userId} and event ${eventId}. Skipping.`);
    return;
  }

  const eventRecord = await this.prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!eventRecord) {
    this.logger.warn(`Event not found: ${eventId}`);
    return;
  }

  // Create the ticket
  const ticket = await this.prisma.ticket.create({
    data: {
      userId,
      eventId,
      type: 'SINGLE',
      status: 'VALID',
      expiration: eventRecord.endTime,
    },
  });
  
  // Create the payment record
  await this.prisma.payment.create({
    data: {
      userId,
      amount: eventRecord.price ?? 0,
      method: 'stripe',
      status: 'completed',
      ticketId: ticket.id,
    },
  });

  this.logger.log(`✅ Ticket created: ${ticket.id} for user ${userId} from event ${eventId}`);
  
  // TODO: Here is where you would trigger PDF generation and email sending
}
}
