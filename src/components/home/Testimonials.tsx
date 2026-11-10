"use client";

import { Quote } from "lucide-react";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import type { Swiper as SwiperT } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { Stars } from "@/components/ui/Bits";
import { SmartImage } from "@/components/ui/SmartImage";
import { CarouselNav } from "@/components/product/ProductCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/data/catalog";
import { portraitImages } from "@/data/images";

export function Testimonials() {
  const swiper = useRef<SwiperT | null>(null);
  const [active, setActive] = useState(0);
  return (
    <section className="bg-ink text-ivory py-20 md:py-28" aria-label="Customer reviews">
      <div className="container-velora grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-blush mb-5">Kind words</p>
          <h2 className="font-serif text-5xl leading-[0.95] md:text-6xl">
            Loved by
            <br />
            <em className="text-blush">48,000+</em> women
          </h2>
          <div className="mt-8 flex items-center gap-3">
            <Stars rating={4.9} size={18} />
            <span className="text-ivory/70 text-sm">4.9 average from 6,200+ reviews</span>
          </div>
          <div className="mt-10">
            <div className="[&_button]:border-ivory/30 [&_button:hover]:bg-ivory [&_button:hover]:text-ink">
              <CarouselNav
                label="review"
                onPrev={() => swiper.current?.slidePrev()}
                onNext={() => swiper.current?.slideNext()}
                atStart={false}
                atEnd={false}
              />
            </div>
          </div>
        </Reveal>
        <div className="min-w-0 lg:col-span-8">
          <Swiper
            modules={[Autoplay, EffectFade, A11y, Keyboard]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            keyboard={{ enabled: true, onlyInViewport: true }}
            onSwiper={(s) => (swiper.current = s)}
            onSlideChange={(s) => setActive(s.realIndex)}
            speed={900}
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={t.name} className="bg-ink">
                <figure className="grid items-center gap-8 md:grid-cols-[220px_1fr] md:gap-12">
                  <div className="bg-ink-soft relative aspect-[4/5] w-40 overflow-hidden md:w-full">
                    <SmartImage
                      src={portraitImages[i % portraitImages.length].src}
                      alt={portraitImages[i % portraitImages.length].alt.replace(
                        /Amaya|Nadeesha|Sophie|Tharushi|Hannah|Dilini|Isabel|Kavya/,
                        t.name.split(" ")[0],
                      )}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Quote className="text-blush h-8 w-8" strokeWidth={1} />
                    <blockquote className="mt-4 font-serif text-3xl leading-[1.2] font-light md:text-[2.6rem]">“{t.quote}”</blockquote>
                    <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <Stars rating={t.rating} />
                      <span className="font-medium">{t.name}</span>
                      <span className="text-ivory/50">{t.city}</span>
                      <span className="text-ivory/50">· wearing {t.product}</span>
                    </figcaption>
                  </div>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mt-10 flex gap-2" aria-hidden>
            {testimonials.map((t, i) => (
              <span key={t.name} className={`h-px flex-1 transition-colors duration-500 ${i === active ? "bg-ivory" : "bg-ivory/20"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
