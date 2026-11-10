"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { forwardRef, useRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "ghost" | "light" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-velora)] focus-visible:outline-offset-4 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary: "bg-rose text-white hover:bg-rose-deep shadow-[0_10px_30px_-12px_rgba(183,110,121,0.7)]",
  dark: "bg-ink text-ivory hover:bg-ink-soft",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-ivory",
  ghost: "text-ink hover:bg-ink/5",
  light: "bg-ivory text-ink hover:bg-white",
  link: "px-0! h-auto! text-ink link-underline pb-1 tracking-[0.22em]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5",
  md: "h-12 px-7",
  lg: "h-14 px-9 text-[0.75rem]",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, children, type = "button", ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClasses({ variant, size, className })} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
});

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}

/** Wraps any CTA so it gently follows the pointer (desktop only). */
export function Magnetic({ children, strength = 0.3, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
