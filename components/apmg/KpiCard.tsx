"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Kpi } from "@/lib/data/leads";
import { useCountUp } from "@/lib/useCountUp";
import { SignalLed } from "./SignalLed";

/** A small SVG trend line. Graphical (red fill ok), decorative. */
function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="h-7 w-full opacity-80"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--bar)"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * KPI as an instrument gauge: stamped tiny-caps label, a Signal LED, a hero
 * monospace readout that ticks up on load, a delta whose colour encodes
 * good/bad WITHIN the red family (no green — §design), and a trend spark.
 * Rendered as a real <button> so it is keyboard-activatable and tracked.
 */
export function KpiCard({ kpi }: { kpi: Kpi }) {
  const display = useCountUp(kpi.numeric, kpi.format, kpi.value);
  const up = kpi.delta > 0;
  const good = kpi.goodWhenDown ? kpi.delta < 0 : kpi.delta > 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;

  return (
    <button
      type="button"
      data-track="kpi_card_click"
      data-track-kpi={kpi.id}
      aria-label={`${kpi.label}: ${kpi.value}, ${good ? "favourable" : "unfavourable"} trend`}
      className="group relative overflow-hidden rounded-xl bg-card p-4 text-left ring-1 ring-foreground/10 transition-colors hover:bg-muted/40"
    >
      {/* machined bezel highlight on hover/focus */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {kpi.label}
        </span>
        <SignalLed />
      </div>

      <div className="tnum mt-3 font-mono text-[34px] font-semibold leading-none tracking-tight text-foreground sm:text-[40px]">
        {display}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span
          className={cn(
            "tnum inline-flex items-center gap-0.5 font-mono text-xs font-semibold",
            good ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Arrow className="h-3.5 w-3.5" aria-hidden />
          {Math.abs(kpi.delta)}
          {kpi.deltaUnit}
        </span>
        <span className="truncate text-[11px] text-muted-foreground">{kpi.caption}</span>
      </div>

      <div className="mt-3">
        <Sparkline data={kpi.spark} />
      </div>
    </button>
  );
}
