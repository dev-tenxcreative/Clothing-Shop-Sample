"use client";

import { AnimatePresence, motion, type TargetAndTransition } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { useMounted } from "@/store";
import { cn } from "@/lib/utils";

type Placement = "center" | "right" | "left" | "bottom" | "full";

const panelMotion: Record<Placement, { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }> = {
  center: {
    initial: { opacity: 0, y: 24, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.98 },
  },
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
  left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
  bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  full: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

const panelClass: Record<Placement, string> = {
  center: "relative m-auto max-h-[90dvh] w-[min(92vw,var(--modal-w,720px))] overflow-y-auto bg-ivory shadow-2xl",
  right: "absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-ivory shadow-2xl",
  left: "absolute inset-y-0 left-0 flex w-full max-w-[420px] flex-col bg-ivory shadow-2xl",
  bottom: "absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-2xl bg-ivory shadow-2xl",
  full: "absolute inset-0 overflow-y-auto bg-ivory",
};

/**
 * Accessible dialog: portal, focus trap, Escape to close, scroll lock,
 * restores focus to the trigger on close.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  placement = "center",
  className,
  hideClose,
  labelledBy,
  width,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  placement?: Placement;
  className?: string;
  hideClose?: boolean;
  labelledBy?: string;
  width?: number;
}) {
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const titleId = labelledBy ?? `${autoId}-title`;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    lockScroll();
    const t = window.setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>("[data-autofocus], input, button, a[href]");
      el?.focus({ preventScroll: true });
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      previous?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const m = panelMotion[placement];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex" data-lenis-prevent>
          <motion.div
            className="bg-ink/45 absolute inset-0 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : labelledBy}
            className={cn(panelClass[placement], className)}
            style={width ? ({ "--modal-w": `${width}px` } as React.CSSProperties) : undefined}
            initial={m.initial}
            animate={m.animate}
            exit={m.exit}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {(title || !hideClose) && (
              <div
                className={cn(
                  "flex items-center justify-between gap-4",
                  title ? "border-line border-b px-6 py-5" : "absolute top-3 right-3 z-10",
                )}
              >
                {title && (
                  <h2 id={titleId} className="font-serif text-2xl">
                    {title}
                  </h2>
                )}
                {!hideClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="bg-ivory/80 hover:bg-ink/5 grid h-10 w-10 place-items-center rounded-full transition hover:rotate-90"
                  >
                    <X className="h-5 w-5" strokeWidth={1.4} />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
