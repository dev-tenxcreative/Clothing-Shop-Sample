import { detectBrand, last4 } from "./card";
import type { CardInput, CardToken, PaymentRequest, PaymentResult, PaymentService } from "./types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Mock gateway for development and demos. It never stores, logs or sends card
 * data anywhere — it only derives the brand and last four digits for display.
 *
 * Test behaviour:
 *  - Any Luhn-valid number is approved.
 *  - A card number ending in 0002 is declined (to demo the error state).
 */
export class MockPaymentService implements PaymentService {
  readonly provider = "mock";

  async tokenizeCard(card: CardInput): Promise<CardToken> {
    // TODO: integrate payment gateway — replace with the provider SDK, e.g.
    //   Stripe:  stripe.createPaymentMethod({ type: "card", card: cardElement })
    //   PayHere: redirect to the hosted checkout instead of collecting cards here
    await wait(500);
    const brand = detectBrand(card.number);
    const tail = last4(card.number);
    return { token: `tok_mock_${Math.random().toString(36).slice(2, 10)}`, brand, last4: tail, expiry: card.expiry };
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResult> {
    // TODO: integrate payment gateway — call your server, which creates the
    // charge/intent with the provider using the token and returns the status.
    await wait(1100);
    if (request.method === "cod") {
      return { status: "pending", transactionId: `cod_${request.orderId}`, message: "Pay with cash when your order arrives." };
    }
    if (request.card?.last4 === "0002") {
      return { status: "failed", message: "Your bank declined this card. Please try another card or choose Cash on Delivery." };
    }
    return { status: "authorized", transactionId: `txn_mock_${Date.now().toString(36)}` };
  }
}
