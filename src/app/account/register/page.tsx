import type { Metadata } from "next";
import { AuthShell, RegisterForm } from "@/components/account/AuthForms";
import { lifestyleImages } from "@/data/images";

export const metadata: Metadata = { title: "Create an account", alternates: { canonical: "/account/register" } };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Join the Circle"
      subtitle="Members get 10% off their first order, early access to new collections and private sale invitations."
      image={lifestyleImages.flowers}
    >
      <RegisterForm />
    </AuthShell>
  );
}
