"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { emailSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { z } from "zod";

type Values = z.infer<typeof emailSchema>;

/** Newsletter capture. `variant="large"` for the homepage, `"mini"` for the footer. */
export function NewsletterForm({ variant = "large", tone = "dark" }: { variant?: "large" | "mini"; tone?: "dark" | "light" }) {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(emailSchema) });

  const onSubmit = async () => {
    // TODO: connect to your email platform (Klaviyo, Mailchimp, etc.)
    await new Promise((r) => setTimeout(r, 900));
    setDone(true);
  };

  const light = tone === "light";

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex items-center gap-4", variant === "large" ? "min-h-16" : "min-h-12")}
            role="status"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", light ? "bg-ivory text-ink" : "bg-rose text-white")}
            >
              <Check className="h-5 w-5" />
            </motion.span>
            <div>
              <p className={cn("font-serif text-2xl leading-tight", light ? "text-ivory" : "text-ink")}>Welcome to the Circle.</p>
              <p className={cn("text-sm", light ? "text-ivory/70" : "text-ink-soft")}>
                Your 10% code <strong className="font-semibold">CIRCLE10</strong> is on its way to your inbox.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit(onSubmit)} noValidate className="group">
            <label htmlFor={`nl-${variant}`} className="sr-only">
              Email address
            </label>
            <div
              className={cn(
                "relative flex items-center border-b transition-colors duration-500",
                light ? "border-ivory/40 focus-within:border-ivory" : "border-ink/30 focus-within:border-ink",
                variant === "large" ? "h-16" : "h-12",
              )}
            >
              <input
                id={`nl-${variant}`}
                type="email"
                autoComplete="email"
                placeholder="Your email address"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
                className={cn(
                  "h-full flex-1 bg-transparent outline-none",
                  light ? "text-ivory placeholder:text-ivory/50" : "text-ink placeholder:text-ink-muted",
                  variant === "large" ? "font-serif text-2xl md:text-3xl" : "text-sm",
                )}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label="Subscribe"
                className={cn(
                  "grid shrink-0 place-items-center rounded-full transition-all duration-500 group-focus-within:scale-105",
                  light ? "bg-ivory text-ink hover:bg-blush" : "bg-ink text-ivory hover:bg-rose",
                  variant === "large" ? "h-12 w-12" : "h-9 w-9",
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </button>
              <span
                className={cn(
                  "absolute -bottom-px left-0 h-px w-0 transition-all duration-700 ease-[var(--ease-velora)] group-focus-within:w-full",
                  light ? "bg-blush" : "bg-rose",
                )}
              />
            </div>
            {errors.email && (
              <p role="alert" className={cn("mt-2 text-xs", light ? "text-blush" : "text-rose-deep")}>
                {errors.email.message}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
