"use client";

import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Floating-label input with error message wired to aria-describedby. */
export const Field = forwardRef<
  HTMLInputElement,
  ComponentProps<"input"> & { label: string; error?: string; hint?: string; trailing?: ReactNode }
>(function Field({ label, error, hint, trailing, className, id, ...props }, ref) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <input
          ref={ref}
          id={fieldId}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            "peer text-ink h-14 w-full border bg-white/60 px-4 pt-6 pb-2 text-[0.95rem] transition-colors outline-none placeholder:text-transparent focus:bg-white",
            error ? "border-rose" : "border-line focus:border-ink",
            trailing && "pr-12",
          )}
          {...props}
        />
        <label
          htmlFor={fieldId}
          className="text-ink-muted pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[0.9rem] transition-all duration-200 peer-focus:top-4 peer-focus:text-[0.68rem] peer-focus:tracking-wide peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[0.68rem] peer-[:not(:placeholder-shown)]:tracking-wide"
        >
          {label}
        </label>
        {trailing && <div className="absolute top-1/2 right-3 -translate-y-1/2">{trailing}</div>}
      </div>
      {error ? (
        <p id={`${fieldId}-error`} role="alert" className="text-rose-deep mt-1.5 text-xs">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="text-ink-muted mt-1.5 text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export const SelectField = forwardRef<HTMLSelectElement, ComponentProps<"select"> & { label: string; error?: string; options: string[] }>(
  function SelectField({ label, error, options, className, id, ...props }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <div className={className}>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(
              "h-14 w-full appearance-none border bg-white/60 px-4 pt-6 pb-2 text-[0.95rem] transition-colors outline-none focus:bg-white",
              error ? "border-rose" : "border-line focus:border-ink",
            )}
            {...props}
          >
            <option value="">Select…</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <label htmlFor={fieldId} className="text-ink-muted pointer-events-none absolute top-4 left-4 text-[0.68rem] tracking-wide">
            {label}
          </label>
          <svg
            className="text-ink-muted pointer-events-none absolute top-1/2 right-4 h-3 w-3 -translate-y-1/2"
            viewBox="0 0 12 12"
            aria-hidden
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.4" />
          </svg>
        </div>
        {error && (
          <p id={`${fieldId}-error`} role="alert" className="text-rose-deep mt-1.5 text-xs">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export const TextArea = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea"> & { label: string; error?: string }>(function TextArea(
  { label, error, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="text-ink-muted mb-2 block text-[0.8rem]">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        rows={5}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(
          "w-full resize-y border bg-white/60 p-4 text-[0.95rem] transition-colors outline-none focus:bg-white",
          error ? "border-rose" : "border-line focus:border-ink",
        )}
        {...props}
      />
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-rose-deep mt-1.5 text-xs">
          {error}
        </p>
      )}
    </div>
  );
});

export const Checkbox = forwardRef<HTMLInputElement, ComponentProps<"input"> & { label: ReactNode; error?: string }>(function Checkbox(
  { label, error, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="text-ink-soft flex cursor-pointer items-start gap-3 text-sm">
        <input ref={ref} id={fieldId} type="checkbox" className="accent-ink mt-0.5 h-4 w-4 shrink-0 cursor-pointer" {...props} />
        <span>{label}</span>
      </label>
      {error && (
        <p role="alert" className="text-rose-deep mt-1.5 text-xs">
          {error}
        </p>
      )}
    </div>
  );
});
