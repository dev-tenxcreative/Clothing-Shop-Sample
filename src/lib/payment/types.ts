/**
 * Payment gateway abstraction.
 *
 * The checkout UI only talks to `PaymentService`. To go live, implement this
 * interface for your provider (Stripe, PayHere, Braintree, Adyen…) and export
 * it from `./index.ts`. Card data must be handed to the provider's own SDK /
 * hosted fields for tokenisation — your servers should only ever see a token.
 */
import type { CardBrand } from "./card";

export type PaymentMethod = "card" | "cod";

/** Raw card input lives only in component state and is passed straight to `tokenizeCard`. */
export interface CardInput {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export interface CardToken {
  token: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  customer: { email: string; name: string; phone?: string };
  card?: CardToken;
  billingAddress?: { line1: string; city: string; postalCode: string; country: string };
}

export type PaymentStatus = "authorized" | "pending" | "requires_action" | "failed";

export interface PaymentResult {
  status: PaymentStatus;
  transactionId?: string;
  /** For 3-D Secure or redirect-based gateways (e.g. PayHere checkout). */
  redirectUrl?: string;
  message?: string;
}

export interface PaymentService {
  readonly provider: string;
  /** Exchange raw card details for a single-use token via the gateway SDK. */
  tokenizeCard(card: CardInput): Promise<CardToken>;
  /** Authorise / create the payment for an order. */
  createPayment(request: PaymentRequest): Promise<PaymentResult>;
}
