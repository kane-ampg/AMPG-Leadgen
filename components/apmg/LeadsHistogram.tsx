"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { LEADS_BY_MONTH, LEADS_BY_SOURCE, type Bar } from "@/lib/data/leads";
import { formatInt } from "@/lib/format";

type Mode = "month" | "source";

const MODES: { id: Mode; label: string; data: Bar[]; unit: string }[] = [
  { id: "month", label: "By month", data: LEADS_BY_MONTH, unit: "leads" },
  { id: "source", label: "By source", data: LEADS_BY_SOURCE, unit: "leads" },
];

export function LeadsHistogram() {
  const [mode, setMode] = useState<Mode>("month");
  const config = MODES.find((m) => m.id === mode)!;
  const data = config.data;
  const max = Math.max(...data.map((d) => d.value));

  const currentIndex = Math.max(
    data.findIndex((d) => d.current),
    0,
  );
  const [selected, setSelected] = useState(currentIndex);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? selected;
  const reading = data[active] ?? data[currentIndex];

  function pickMode(next: Mode) {
    setMode(next);
    const nextData = MODES.find((m) => m.id === next)!.data;
    setSelected(Math.max(nextData.findIndex((d) => d.current), 0));
    setHovered(null);
  }

  return (
    <section
      className="flex h-full min-w-0 flex-col rounded-xl bg-card p-4 ring-1 ring-foreground/10"
      aria-label="Lead volume histogram"
    >
      {/* panel head: title + docked readout + mode toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-heading text-sm font-semibold text-foreground">Lead volume</h2>
          <span className="tnum font-mono text-[11px] text-muted-foreground">
            <span className="text-foreground">{reading.label}</span>
            {" · "}
            <span className="text-primary">{formatInt(reading.value)}</span> {config.unit}
          </span>
        </div>

        <div
          className="flex items-center gap-0.5 rounded-md border border-border bg-background/50 p-0.5"
          role="group"
          aria-label="Histogram view"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              data-track="histogram_mode"
              data-track-mode={m.id}
              onClick={() => pickMode(m.id)}
              aria-pressed={mode === m.id}
              className={cn(
                "rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                mode === m.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* bars */}
      <div className="relative mt-5 min-h-[180px] flex-1">
        {/* faint datum gridlines */}
        {[0.25, 0.5, 0.75].map((g) => (
          <span
            key={g}
            aria-hidden
            className="absolute inset-x-0 h-px"
            style={{ bottom: `${g * 100}%`, background: "var(--grid)" }}
          />
        ))}

        <div className="relative flex h-full items-end gap-1.5 sm:gap-2">
          {data.map((bar, i) => {
            const pct = (bar.value / max) * 100;
            const isActive = i === active;
            return (
              <button
                key={bar.label}
                type="button"
                data-track="histogram_bar"
                data-track-bucket={bar.label}
                data-track-value={bar.value}
                onClick={() => setSelected(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                aria-label={`${bar.label}: ${formatInt(bar.value)} ${config.unit}`}
                aria-pressed={i === selected}
                className="group relative flex h-full min-w-0 flex-1 flex-col justify-end rounded-t-sm"
              >
                {/* CSS rise gated by motion-safe so reduced-motion users get a
                    static bar with no first-render flash; per-bar stagger via
                    inline animation-delay. */}
                <span
                  className="w-full rounded-t-[2px] transition-opacity motion-safe:animate-bar-rise"
                  style={{
                    height: `${pct}%`,
                    background: isActive ? "var(--bar-strong)" : "var(--bar)",
                    opacity: isActive ? 1 : 0.62,
                    transformOrigin: "bottom",
                    animationDelay: `${Math.min(i * 0.04, 0.4)}s`,
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* baseline datum + x labels */}
      <div className="mt-1 h-px w-full" style={{ background: "hsl(var(--primary) / 0.5)" }} aria-hidden />
      <div className="mt-1.5 flex gap-1.5 sm:gap-2">
        {data.map((bar, i) => (
          <span
            key={bar.label}
            className={cn(
              "tnum min-w-0 flex-1 truncate text-center font-mono text-[9px] uppercase tracking-[0.04em]",
              i === active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {bar.label}
          </span>
        ))}
      </div>
    </section>
  );
}
