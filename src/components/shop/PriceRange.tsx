"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

/** Dual-thumb price slider built from two native range inputs (keyboard accessible). */
export function PriceRange({
  min,
  max,
  value,
  step = 250,
  onCommit,
}: {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  onCommit: (v: [number, number]) => void;
}) {
  const [v, setV] = useState<[number, number]>(value);
  const [prev, setPrev] = useState(value);
  if (value[0] !== prev[0] || value[1] !== prev[1]) {
    setPrev(value);
    setV(value);
  }

  const pct = (n: number) => ((n - min) / (max - min)) * 100;
  const commit = () => onCommit(v);
  const thumb =
    "pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-ivory [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-ivory";

  return (
    <div>
      <div className="relative h-6">
        <div className="bg-line absolute inset-x-0 top-1/2 h-px -translate-y-1/2" />
        <div className="bg-ink absolute top-1/2 h-[2px] -translate-y-1/2" style={{ left: `${pct(v[0])}%`, right: `${100 - pct(v[1])}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={v[0]}
          aria-label="Minimum price"
          aria-valuetext={formatPrice(v[0])}
          onChange={(e) => setV([Math.min(Number(e.target.value), v[1] - step), v[1]])}
          onPointerUp={commit}
          onKeyUp={commit}
          className={thumb}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={v[1]}
          aria-label="Maximum price"
          aria-valuetext={formatPrice(v[1])}
          onChange={(e) => setV([v[0], Math.max(Number(e.target.value), v[0] + step)])}
          onPointerUp={commit}
          onKeyUp={commit}
          className={thumb}
        />
      </div>
      <div className="text-ink-soft mt-3 flex justify-between text-xs tabular-nums">
        <span>{formatPrice(v[0])}</span>
        <span>{formatPrice(v[1])}</span>
      </div>
    </div>
  );
}
