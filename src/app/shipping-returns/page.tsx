import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/brand/Legal";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "VELORA delivery options, costs and timelines, plus our easy 14-day returns and exchanges policy.",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingReturnsPage() {
  const { delivery, freeDeliveryThreshold, returnDays, cashOnDelivery } = siteConfig.commerce;
  return (
    <LegalPage
      title="Shipping & Returns"
      updated="1 November 2026"
      intro={
        <p>Every order is packed by hand in our Colombo atelier and delivered island-wide. Changed your mind? Returns are free and easy.</p>
      }
      sections={[
        {
          id: "delivery",
          title: "Delivery options",
          body: (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-ink/20 border-b">
                      <th className="text-ink py-2 pr-4 font-medium">Method</th>
                      <th className="text-ink py-2 pr-4 font-medium">Time</th>
                      <th className="text-ink py-2 font-medium">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-line border-b">
                      <td className="py-2 pr-4">{delivery.standard.label}</td>
                      <td className="py-2 pr-4">
                        {delivery.standard.minDays}–{delivery.standard.maxDays} working days
                      </td>
                      <td className="py-2">
                        {formatPrice(delivery.standard.price)} · free over {formatPrice(freeDeliveryThreshold)}
                      </td>
                    </tr>
                    <tr className="border-line border-b">
                      <td className="py-2 pr-4">{delivery.express.label}</td>
                      <td className="py-2 pr-4">
                        {delivery.express.minDays}–{delivery.express.maxDays} working days
                      </td>
                      <td className="py-2">{formatPrice(delivery.express.price)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Orders placed before 2pm (Monday–Saturday) are dispatched the same day. Express delivery is available for Colombo and
                suburbs.
              </p>
            </>
          ),
        },
        {
          id: "cod",
          title: "Cash on Delivery",
          body: (
            <p>
              Cash on Delivery is available island-wide for orders up to {formatPrice(75000)}, with a {formatPrice(cashOnDelivery.fee)}{" "}
              handling fee. Please keep the exact amount ready for our courier.
            </p>
          ),
        },
        {
          id: "returns",
          title: `${returnDays}-day returns`,
          body: (
            <>
              <p>
                You can return unworn items with their tags attached within {returnDays} days of delivery for a full refund or exchange.
              </p>
              <ul>
                <li>Free collection from your door within Sri Lanka</li>
                <li>Refunds to your original payment method within 5–7 working days</li>
                <li>Cash on Delivery orders are refunded by bank transfer</li>
              </ul>
            </>
          ),
        },
        {
          id: "how",
          title: "How to return",
          body: (
            <p>
              Sign in to <Link href="/account">your account</Link>, open the order and choose “Return items”, or message us on WhatsApp with
              your order number. We’ll arrange a collection within two working days.
            </p>
          ),
        },
        {
          id: "exceptions",
          title: "Exceptions",
          body: (
            <p>
              For hygiene reasons, earrings and swimwear can only be returned if the seal is unbroken. Items marked as final sale cannot be
              returned. Altered items are not eligible for return.
            </p>
          ),
        },
      ]}
    />
  );
}
