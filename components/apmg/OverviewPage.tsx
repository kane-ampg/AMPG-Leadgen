"use client";

import { KPIS } from "@/lib/data/leads";
import { Footer } from "./Footer";
import { KpiCard } from "./KpiCard";
import { LeadsHistogram } from "./LeadsHistogram";
import { RecentLeadsTable } from "./RecentLeadsTable";
import { Reveal } from "./Reveal";

export function OverviewPage() {
  return (
    <div className="flex min-h-full flex-col px-4 py-5 sm:px-6">
      {/* in-page section header */}
      <Reveal className="mb-5" y={6}>
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Signal overview
            </div>
            <h1 className="mt-1 text-base font-semibold tracking-tight text-foreground sm:text-xl">
              Lead pipeline
            </h1>
          </div>
          <div className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <div>Reporting period</div>
            <div className="tnum text-foreground/80">01 – 29 Jun 2026</div>
          </div>
        </div>
      </Reveal>

      {/* 3 KPI cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {KPIS.map((kpi, i) => (
          <Reveal key={kpi.id} delay={0.04 * i}>
            <KpiCard kpi={kpi} />
          </Reveal>
        ))}
      </div>

      {/* histogram + small table, side by side on lg (equal height) */}
      <div className="mt-3 grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[1.45fr_1fr]">
        <Reveal delay={0.12} className="h-full">
          <LeadsHistogram />
        </Reveal>
        <Reveal delay={0.16} className="h-full">
          <RecentLeadsTable />
        </Reveal>
      </div>

      <Footer />
    </div>
  );
}
