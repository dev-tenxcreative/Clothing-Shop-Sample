import { MockPaymentService } from "./mock";
import type { PaymentService } from "./types";

/**
 * The active payment gateway.
 *
 * TODO: integrate payment gateway — swap the mock for a real adapter:
 *
 *   import { StripePaymentService } from "./stripe";
 *   export const paymentService: PaymentService = new StripePaymentService(process.env.NEXT_PUBLIC_STRIPE_KEY!);
 *
 * Keep secret keys on the server (Route Handlers / Server Actions) and never
 * persist raw card numbers or CVV codes anywhere.
 */
export const paymentService: PaymentService = new MockPaymentService();

export * from "./types";
export * from "./card";
