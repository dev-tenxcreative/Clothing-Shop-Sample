"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, FreeMode, Keyboard, Navigation } from "swiper/modules";
import type { Swiper as SwiperT } from "swiper";
import "swiper/css";
import type { Product } from "@/data/types";
import { SectionHeading } from "@/components/ui/Bits";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

export function CarouselNav({
  onPrev,
  onNext,
  atStart,
  atEnd,
  label,
}: {
  onPrev: () => void;
  onNext: () => void;
  atStart: boolean;
  atEnd: boolean;
  label: string;
}) {
  const btn =
    "grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition hover:border-ink hover:bg-ink hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink";
  return (
    <div className="flex gap-2">
      <button className={btn} onClick={onPrev} disabled={atStart} aria-label={`Previous ${label}`}>
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button className={btn} onClick={onNext} disabled={atEnd} aria-label={`Next ${label}`}>
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function ProductCarousel({
  products,
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  products: Product[];
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const swiper = useRef<SwiperT | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [progress, setProgress] = useState(0);

  if (!products.length) return null;

  return (
    <section className={cn("overflow-hidden py-20 md:py-28", className)}>
      <div className="container-velora">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
            <div className="flex items-center gap-6">
              {action}
              <div className="hidden md:block">
                <CarouselNav
                  label="products"
                  onPrev={() => swiper.current?.slidePrev()}
                  onNext={() => swiper.current?.slideNext()}
                  atStart={edges.start}
                  atEnd={edges.end}
                />
              </div>
            </div>
          }
        />
        <Swiper
          modules={[Navigation, A11y, Keyboard, FreeMode]}
          onSwiper={(s) => {
            swiper.current = s;
            setEdges({ start: s.isBeginning, end: s.isEnd });
          }}
          onSlideChange={(s) => setEdges({ start: s.isBeginning, end: s.isEnd })}
          onProgress={(_, p) => setProgress(p)}
          onReachEnd={() => setEdges((e) => ({ ...e, end: true }))}
          keyboard={{ enabled: true, onlyInViewport: true }}
          freeMode={{ enabled: true, sticky: true }}
          slidesPerView={1.6}
          spaceBetween={14}
          breakpoints={{
            640: { slidesPerView: 2.4, spaceBetween: 18 },
            1024: { slidesPerView: 3.3, spaceBetween: 22 },
            1280: { slidesPerView: 4, spaceBetween: 26 },
          }}
          className="overflow-visible!"
          a11y={{ prevSlideMessage: "Previous product", nextSlideMessage: "Next product" }}
        >
          {products.map((p) => (
            <SwiperSlide key={p.id}>
              <ProductCard product={p} sizes="(min-width: 1280px) 22vw, (min-width: 640px) 38vw, 60vw" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="bg-line mt-10 h-px w-full" aria-hidden>
          <div className="bg-ink h-px transition-[width] duration-300" style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
      </div>
    </section>
  );
}
