import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/brand/Legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you shop with VELORA.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="1 November 2026"
      intro={
        <p>
          These terms apply to all purchases made on this website. Please read them carefully. (Template copy — review with your legal
          advisor before launch.)
        </p>
      }
      sections={[
        {
          id: "orders",
          title: "Orders",
          body: (
            <p>
              Your order is an offer to buy. A contract is formed when we email you to confirm dispatch. We may decline an order if an item
              is unavailable or a pricing error occurs, in which case we’ll refund you in full.
            </p>
          ),
        },
        {
          id: "pricing",
          title: "Pricing & payment",
          body: (
            <p>
              Prices are shown in Sri Lankan Rupees (LKR) and include applicable taxes. Payment is taken when you place your order, or on
              delivery for Cash on Delivery orders.
            </p>
          ),
        },
        {
          id: "promotions",
          title: "Promotions",
          body: (
            <p>
              Promo codes are limited to one per order, cannot be exchanged for cash and may not be combined with other offers unless
              stated.
            </p>
          ),
        },
        {
          id: "delivery",
          title: "Delivery",
          body: (
            <p>
              Delivery estimates are given in good faith. See <Link href="/shipping-returns">Shipping &amp; Returns</Link> for details.
            </p>
          ),
        },
        {
          id: "returns",
          title: "Returns",
          body: <p>You may return items within 14 days in line with our returns policy. Your statutory rights are not affected.</p>,
        },
        {
          id: "ip",
          title: "Intellectual property",
          body: (
            <p>
              All designs, photography and content on this website are owned by VELORA or its licensors and may not be reproduced without
              permission.
            </p>
          ),
        },
        {
          id: "law",
          title: "Governing law",
          body: <p>These terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka.</p>,
        },
      ]}
    />
  );
}
