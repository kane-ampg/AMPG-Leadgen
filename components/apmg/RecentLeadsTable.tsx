"use client";

import { cn } from "@/lib/cn";
import { RECENT_LEADS, type LeadRow, type LeadStatus } from "@/lib/data/leads";
import { formatUsd } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HOT_THRESHOLD = 85;

/* Status stays inside the black/red + neutral system — no extra hues.
   Red marks the favourable end (qualified / won); muted marks the rest. */
const STATUS: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "border-border bg-muted text-muted-foreground" },
  contacted: { label: "Contacted", className: "border-border bg-background text-foreground/80" },
  qualified: {
    // bg-transparent keeps Signal-red text on the solid card (4.75:1 AA) —
    // a /10 tint would lighten the local bg and drop it to 4.38:1.
    label: "Qualified",
    className: "border-primary/40 bg-transparent text-primary",
  },
  // solid fill uses the darker primary-solid so WHITE text passes AA.
  won: { label: "Won", className: "border-transparent bg-primary-solid text-primary-foreground" },
  lost: {
    label: "Lost",
    className: "border-border bg-transparent text-muted-foreground line-through decoration-muted-foreground/40",
  },
};

function StatusPill({ status }: { status: LeadStatus }) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}

function Row({ lead }: { lead: LeadRow }) {
  const hot = lead.score >= HOT_THRESHOLD;
  return (
    <TableRow
      tabIndex={0}
      role="button"
      data-track="lead_row"
      data-track-lead={lead.id}
      data-track-status={lead.status}
      aria-label={`Lead ${lead.name}, ${lead.company}, score ${lead.score}, ${lead.status}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
      className="cursor-pointer outline-none hover:shadow-[inset_2px_0_0_0_hsl(var(--primary))] focus-visible:shadow-[inset_0_0_0_2px_hsl(var(--ring))]"
    >
      <TableCell className="py-2.5">
        <div className="text-[13px] font-medium text-foreground">{lead.name}</div>
        <div className="mt-px truncate font-mono text-[10.5px] text-muted-foreground">
          {lead.company} · {lead.source}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <span className="tnum inline-flex items-center justify-end gap-1 font-mono text-[13px] text-foreground">
          {hot && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              aria-label="hot lead"
              role="img"
            />
          )}
          {lead.score}
        </span>
      </TableCell>
      <TableCell>
        <StatusPill status={lead.status} />
      </TableCell>
      <TableCell className="tnum text-right font-mono text-[13px] text-foreground">
        {formatUsd(lead.value)}
      </TableCell>
    </TableRow>
  );
}

export function RecentLeadsTable() {
  return (
    <section
      className="flex h-full min-w-0 flex-col rounded-xl bg-card ring-1 ring-foreground/10"
      aria-label="Recent leads"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-heading text-sm font-semibold text-foreground">Recent leads</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          last 24h
        </span>
      </div>
      <div className="min-w-0 px-2 pb-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Lead</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RECENT_LEADS.map((lead) => (
              <Row key={lead.id} lead={lead} />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
