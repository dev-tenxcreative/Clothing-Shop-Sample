import type { Metadata } from "next";
import { AuthShell, ForgotForm } from "@/components/account/AuthForms";
import { lifestyleImages } from "@/data/images";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter your email and we’ll send you a link to choose a new password."
      image={lifestyleImages.meadow}
    >
      <ForgotForm />
    </AuthShell>
  );
}
