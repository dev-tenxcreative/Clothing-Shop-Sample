"use client";

/** Animates a thumbnail from `from` to the header bag icon. */
export function flyToCart(from: Element | null, src: string) {
  if (typeof window === "undefined" || !from) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = document.querySelector("[data-cart-target]");
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = Math.min(a.width, 160);
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  Object.assign(img.style, {
    position: "fixed",
    left: `${a.left + a.width / 2 - size / 2}px`,
    top: `${a.top + a.height / 2 - (size * 1.25) / 2}px`,
    width: `${size}px`,
    height: `${size * 1.25}px`,
    objectFit: "cover",
    zIndex: "150",
    pointerEvents: "none",
    borderRadius: "2px",
    boxShadow: "0 20px 40px -10px rgba(28,26,25,.4)",
  });
  document.body.appendChild(img);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = img.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1, borderRadius: "2px" },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 80}px) scale(0.55)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0.4, borderRadius: "50%" },
    ],
    { duration: 850, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
  );
  anim.onfinish = () => {
    img.remove();
    target.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], {
      duration: 400,
      easing: "ease-out",
    });
  };
}
