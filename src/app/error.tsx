"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Monogram } from "@/components/brand/Logo";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // TODO: report to your error-monitoring service (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="container-velora flex min-h-[70svh] flex-col items-center justify-center py-20 text-center">
      <Monogram className="text-rose h-16 w-16" />
      <h1 className="mt-8 font-serif text-5xl md:text-6xl">A loose thread.</h1>
      <p className="text-ink-soft mt-4 max-w-md text-sm">
        Something went wrong on our side. Please try again — your bag and wishlist are safe.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="bg-ink text-ivory hover:bg-rose h-12 px-7 text-[0.72rem] font-semibold tracking-[0.2em] uppercase transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border-ink hover:bg-ink hover:text-ivory inline-flex h-12 items-center border px-7 text-[0.72rem] font-semibold tracking-[0.2em] uppercase transition"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
