"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field } from "@/components/ui/Form";
import { SmartImage } from "@/components/ui/SmartImage";
import type { ProductImage } from "@/data/types";
import { emailSchema, loginSchema, registerSchema } from "@/lib/validation";
import { useAccount } from "@/store/account";
import { toast } from "@/store";
import { cn } from "@/lib/utils";

/** Split layout used by all auth pages: editorial image + form. */
export function AuthShell({
  title,
  subtitle,
  image,
  children,
}: {
  title: string;
  subtitle: string;
  image: ProductImage;
  children: ReactNode;
}) {
  return (
    <div className="container-velora grid min-h-[calc(100svh-112px)] items-center gap-12 py-10 lg:grid-cols-2 lg:gap-20">
      <div className="bg-blush-soft relative hidden h-full min-h-[640px] overflow-hidden lg:block">
        <SmartImage src={image.src} alt={image.alt} fill preload sizes="50vw" className="object-cover" />
        <div className="from-ink/60 absolute inset-0 bg-gradient-to-t to-transparent" />
        <p className="text-ivory absolute bottom-10 left-10 max-w-xs font-serif text-4xl leading-tight">Grace, in every thread.</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto w-full max-w-md"
      >
        <h1 className="font-serif text-5xl md:text-6xl">{title}</h1>
        <p className="text-ink-soft mt-3 text-sm">{subtitle}</p>
        <div className="mt-10">{children}</div>
      </motion.div>
    </div>
  );
}

function PasswordField(props: React.ComponentProps<typeof Field>) {
  const [show, setShow] = useState(false);
  return (
    <Field
      {...props}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="text-ink-muted hover:text-ink"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      }
    />
  );
}

export function LoginForm() {
  const router = useRouter();
  const login = useAccount((s) => s.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { remember: true } });

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={handleSubmit(async (v) => {
        // TODO: replace with your auth provider (NextAuth/Auth.js, Clerk, Supabase, custom API).
        await new Promise((r) => setTimeout(r, 700));
        login(v.email);
        toast({ title: "Welcome back", description: "You’re signed in." });
        const next = new URLSearchParams(window.location.search).get("next");
        router.push(next && next.startsWith("/") ? next : "/account");
      })}
    >
      <Field label="Email address" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
      <PasswordField label="Password" autoComplete="current-password" {...register("password")} error={errors.password?.message} />
      <div className="flex items-center justify-between">
        <Checkbox label="Keep me signed in" {...register("remember")} />
        <Link href="/account/forgot-password" className="text-xs underline underline-offset-4">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" variant="dark" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
      </Button>
      <p className="text-ink-soft pt-4 text-center text-sm">
        New to VELORA?{" "}
        <Link href="/account/register" className="text-ink font-medium underline underline-offset-4">
          Create an account
        </Link>
      </p>
      <p className="text-ink-muted text-center text-xs">Demo: any email and a 6+ character password will sign you in.</p>
    </form>
  );
}

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function RegisterForm() {
  const router = useRouter();
  const registerUser = useAccount((s) => s.register);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema), defaultValues: { terms: false } });
  const pw = useWatch({ control, name: "password" }) ?? "";
  const s = strength(pw);

  return (
    <form
      noValidate
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={handleSubmit(async (v) => {
        // TODO: call your auth provider's sign-up endpoint.
        await new Promise((r) => setTimeout(r, 800));
        registerUser({ firstName: v.firstName, lastName: v.lastName, email: v.email });
        toast({ title: `Welcome to the Circle, ${v.firstName}`, description: "Your account is ready." });
        router.push("/account");
      })}
    >
      <Field label="First name" autoComplete="given-name" {...register("firstName")} error={errors.firstName?.message} />
      <Field label="Last name" autoComplete="family-name" {...register("lastName")} error={errors.lastName?.message} />
      <Field
        className="sm:col-span-2"
        label="Email address"
        type="email"
        autoComplete="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <div className="sm:col-span-2">
        <PasswordField label="Password" autoComplete="new-password" {...register("password")} error={errors.password?.message} />
        <div className="mt-2 flex gap-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < s ? (s < 2 ? "bg-rose" : s < 4 ? "bg-gold" : "bg-sage-deep") : "bg-line",
              )}
            />
          ))}
        </div>
        <p className="text-ink-muted mt-1 text-xs" aria-live="polite">
          {pw ? ["Too weak", "Weak", "Fair", "Good", "Strong"][s] : "8+ characters with an uppercase letter and a number"}
        </p>
      </div>
      <PasswordField
        className="sm:col-span-2"
        label="Confirm password"
        autoComplete="new-password"
        {...register("confirm")}
        error={errors.confirm?.message}
      />
      <Checkbox
        className="sm:col-span-2"
        {...register("terms")}
        error={errors.terms?.message}
        label={
          <>
            I agree to the{" "}
            <Link href="/terms" className="underline">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline">
              privacy policy
            </Link>
            .
          </>
        }
      />
      <Button type="submit" variant="dark" size="lg" className="w-full sm:col-span-2" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
      </Button>
      <p className="text-ink-soft pt-2 text-center text-sm sm:col-span-2">
        Already a member?{" "}
        <Link href="/account/login" className="text-ink font-medium underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function ForgotForm() {
  const [sent, setSent] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });
  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-line border bg-white/50 p-8 text-center"
          role="status"
        >
          <MailCheck className="text-sage-deep mx-auto h-10 w-10" strokeWidth={1.2} />
          <p className="mt-4 font-serif text-2xl">Check your inbox</p>
          <p className="text-ink-soft mt-2 text-sm">If an account exists for {sent}, we’ve sent a link to reset your password.</p>
          <Link href="/account/login" className="mt-6 inline-block text-sm underline underline-offset-4">
            Back to sign in
          </Link>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0 }}
          noValidate
          className="space-y-4"
          onSubmit={handleSubmit(async (v) => {
            // TODO: trigger your auth provider's password-reset email.
            await new Promise((r) => setTimeout(r, 700));
            setSent(v.email);
          })}
        >
          <Field label="Email address" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
          <Button type="submit" variant="dark" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </Button>
          <p className="text-center text-sm">
            <Link href="/account/login" className="underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
