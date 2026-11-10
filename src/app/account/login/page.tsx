import type { Metadata } from "next";
import { AuthShell, LoginForm } from "@/components/account/AuthForms";
import { lifestyleImages } from "@/data/images";

export const metadata: Metadata = { title: "Sign in", alternates: { canonical: "/account/login" } };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to track orders, save addresses and sync your wishlist." image={lifestyleImages.door}>
      <LoginForm />
    </AuthShell>
  );
}
