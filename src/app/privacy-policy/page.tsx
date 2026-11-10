import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/brand/Legal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How VELORA collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="1 November 2026"
      intro={
        <p>
          Your trust matters to us. This policy explains what information we collect, why we collect it, and the choices you have. (Template
          copy — review with your legal advisor before launch.)
        </p>
      }
      sections={[
        {
          id: "collect",
          title: "What we collect",
          body: (
            <ul>
              <li>Contact details you give us: name, email, phone, delivery address</li>
              <li>Order history and preferences</li>
              <li>Device and usage data collected through essential and (with consent) analytics cookies</li>
            </ul>
          ),
        },
        {
          id: "payments",
          title: "Payment information",
          body: (
            <p>
              Card payments are processed by our PCI-DSS compliant payment partner. VELORA never sees or stores your full card number or
              security code — we only receive a token and the last four digits for your records.
            </p>
          ),
        },
        {
          id: "use",
          title: "How we use it",
          body: (
            <ul>
              <li>To process and deliver your orders</li>
              <li>To provide customer service and handle returns</li>
              <li>To send marketing emails, only if you’ve opted in</li>
              <li>To improve our website and collections</li>
            </ul>
          ),
        },
        {
          id: "cookies",
          title: "Cookies",
          body: (
            <p>
              We use essential cookies to keep your bag and session working. Analytics and marketing cookies are only set if you choose
              “Accept all” in our cookie banner. You can change your choice at any time by clearing your browser storage.
            </p>
          ),
        },
        {
          id: "sharing",
          title: "Sharing your data",
          body: (
            <p>
              We share data only with partners who help us run VELORA — couriers, our payment provider and email platform — under strict
              data-processing agreements. We never sell your personal information.
            </p>
          ),
        },
        {
          id: "rights",
          title: "Your rights",
          body: (
            <p>
              You can access, correct or delete your personal data at any time. Email{" "}
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or <Link href="/contact">contact us</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
