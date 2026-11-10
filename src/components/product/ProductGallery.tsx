"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Pagination, Zoom } from "swiper/modules";
import type { Swiper as SwiperT } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/zoom";
import type { ProductImage } from "@/data/types";
import { Modal } from "@/components/ui/Modal";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  mediaRef,
}: {
  images: ProductImage[];
  name: string;
  mediaRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const mobileSwiper = useRef<SwiperT | null>(null);

  // Reset when the colour (and therefore the image set) changes.
  const key = images.map((i) => i.src).join("|");
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    setActive(0);
  }

  const current = images[active] ?? images[0];

  return (
    <div ref={mediaRef}>
      {/* Mobile: swipeable */}
      <div className="-mx-4 md:hidden">
        <Swiper
          key={key}
          modules={[Pagination, A11y]}
          pagination={{ clickable: true }}
          onSwiper={(s) => (mobileSwiper.current = s)}
          onSlideChange={(s) => setActive(s.activeIndex)}
          className="[--swiper-pagination-bottom:16px]"
        >
          {images.map((img, i) => (
            <SwiperSlide key={img.src + i}>
              <button
                className="bg-blush-soft relative block aspect-[3/4] w-full"
                onClick={() => setLightbox(true)}
                aria-label={`Open image ${i + 1} full screen`}
              >
                <SmartImage src={img.src} alt={img.alt} fill preload={i === 0} sizes="100vw" className="object-cover" />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop: thumbnails + zoom */}
      <div className="hidden gap-4 md:grid md:grid-cols-[84px_1fr]">
        <div className="flex flex-col gap-3" role="tablist" aria-label={`${name} images`}>
          {images.map((img, i) => (
            <button
              key={img.src + i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "bg-blush-soft relative aspect-[3/4] w-full overflow-hidden transition",
                i === active ? "ring-ink ring-offset-ivory ring-1 ring-offset-2" : "opacity-60 hover:opacity-100",
              )}
            >
              <SmartImage src={img.src} alt="" fill sizes="84px" className="object-cover" />
            </button>
          ))}
        </div>
        <div
          className="group bg-blush-soft relative aspect-[3/4] cursor-zoom-in overflow-hidden"
          data-cursor="hidden"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
          onClick={() => setLightbox(true)}
          role="button"
          tabIndex={0}
          aria-label="Open full-screen gallery"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setLightbox(true)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={current.src}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <SmartImage
                src={current.src}
                alt={current.alt}
                fill
                preload={active === 0}
                quality={85}
                sizes="(min-width: 1280px) 45vw, 55vw"
                className="object-cover transition-transform duration-300 ease-out"
                style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
            </motion.div>
          </AnimatePresence>
          <span className="bg-ivory/85 pointer-events-none absolute right-4 bottom-4 grid h-10 w-10 place-items-center rounded-full opacity-0 transition group-hover:opacity-100">
            <Expand className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActive((a) => (a - 1 + images.length) % images.length);
              }}
              className="bg-ivory/85 grid h-10 w-10 place-items-center rounded-full"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActive((a) => (a + 1) % images.length);
              }}
              className="bg-ivory/85 grid h-10 w-10 place-items-center rounded-full"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Modal open={lightbox} onClose={() => setLightbox(false)} placement="full" labelledBy="lightbox-title" className="bg-ink">
        <h2 id="lightbox-title" className="sr-only">
          {name} — image gallery
        </h2>
        <div className="flex h-full items-center">
          <Swiper
            modules={[Zoom, Keyboard, Pagination, A11y]}
            zoom={{ maxRatio: 2.5 }}
            keyboard={{ enabled: true }}
            pagination={{ type: "fraction" }}
            initialSlide={active}
            className="text-ivory h-full w-full [--swiper-pagination-color:#faf7f2] [--swiper-pagination-fraction-color:#faf7f2]"
          >
            {images.map((img, i) => (
              <SwiperSlide key={img.src + i}>
                <div className="swiper-zoom-container h-full">
                  <div className="relative h-[100dvh] w-full">
                    <SmartImage src={img.src} alt={img.alt} fill sizes="100vw" quality={85} className="object-contain" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <p className="text-ivory/60 pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs">
          Double-tap or pinch to zoom · Esc to close
        </p>
      </Modal>
    </div>
  );
}
