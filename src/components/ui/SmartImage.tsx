"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { BLUR_DATA_URL } from "@/data/images";
import { Monogram } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "placeholder" | "blurDataURL"> & { fallbackClassName?: string };

/**
 * next/image with a blush blur placeholder and an elegant fallback
 * (blush gradient + monogram) if the remote image fails to load.
 */
export function SmartImage({ className, fallbackClassName, alt, onError, ...props }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "from-blush-soft via-blush to-sand text-ink/40 absolute inset-0 flex items-center justify-center bg-gradient-to-br",
          fallbackClassName,
        )}
      >
        <Monogram className="h-12 w-12" title="" />
      </span>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}
