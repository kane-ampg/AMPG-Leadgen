"use client";

import { useMemo, useState } from "react";
import {
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  Webhook,
  Workflow,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  AUTOMATIONS,
  N8N_BASE_URL,
  type Automation,
  type AutomationStatus,
  type TriggerKind,
} from "@/lib/data/integrations";
import { Button } from "@/components/ui/button";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";

const TRIGGER: Record<
  TriggerKind,
  { label: string; icon: typeof Webhook }
> = {
  webhook: { label: "Webhook", icon: Webhook },
  schedule: { label: "Schedule", icon: Clock },
  event: { label: "Event", icon: Zap },
};

/* bg-transparent keeps red text on the solid card at AA (4.75:1); a /10 tint
   lightens the local bg and drops red text to ~4.4:1 (fails). */
const STATUS: Record<AutomationStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "border-primary/40 bg-transparent text-primary" },
  paused: { label: "Paused", className: "border-border bg-muted text-muted-foreground" },
  error: {
    label: "Error",
    className: "border-destructive/40 bg-transparent text-destructive",
  },
};

function StatusPill({ status }: { status: AutomationStatus }) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        s.className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" && "bg-primary",
          status === "paused" && "bg-muted-foreground/50",
          status === "error" && "bg-destructive",
        )}
        aria-hidden
      />
      {s.label}
    </span>
  );
}

/** Editorial toggle (on = primary track). Disabled while a workflow is in error. */
function Toggle({
  on,
  disabled,
  onToggle,
  label,
}: {
  on: boolean;
  disabled?: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      data-track="automation_toggle"
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40",
        on ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform",
          on ? "translate-x-[18px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function AutomationCard({
  automation,
  onToggle,
}: {
  automation: Automation;
  onToggle: (id: string) => void;
}) {
  const trigger = TRIGGER[automation.trigger];
  const TriggerIcon = trigger.icon;
  const on = automation.status === "active";
  const errored = automation.status === "error";
  const editorUrl = `${N8N_BASE_URL}/workflow/${automation.workflowId}`;

  return (
    <div className="flex h-full flex-col rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-primary">
            <TriggerIcon className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[13.5px] font-semibold text-foreground">
              {automation.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground">
              <span className="uppercase tracking-[0.1em]">{trigger.label}</span>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span className="truncate">{automation.triggerDetail}</span>
            </div>
          </div>
        </div>
        <Toggle
          on={on}
          disabled={errored}
          onToggle={() => onToggle(automation.id)}
          label={`${on ? "Pause" : "Activate"} ${automation.name}`}
        />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {automation.description}
      </p>

      <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 font-mono text-[10.5px] text-muted-foreground">
        <StatusPill status={automation.status} />
        <span className="tnum">{automation.runs24h} runs · 24h</span>
        <span aria-hidden className="text-border">
          ·
        </span>
        <span className="tnum">{automation.successRate}% ok</span>
        <span className="ml-auto tnum text-foreground/70">{automation.lastRun}</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <a
          href={editorUrl}
          target="_blank"
          rel="noreferrer"
          data-track="automation_open"
          data-track-workflow={automation.workflowId}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          Open in n8n
        </a>
        {errored && (
          <button
            type="button"
            data-track="automation_reconnect"
            data-track-workflow={automation.workflowId}
            className="inline-flex items-center gap-1.5 rounded-md border border-destructive/50 bg-transparent px-2.5 py-1 text-[11px] font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Reconnect
          </button>
        )}
      </div>
    </div>
  );
}

export function IntegrationsPage() {
  const [automations, setAutomations] = useState(AUTOMATIONS);

  function toggle(id: string) {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "paused" : "active" }
          : a,
      ),
    );
  }

  const stats = useMemo(() => {
    const active = automations.filter((a) => a.status === "active").length;
    const errors = automations.filter((a) => a.status === "error").length;
    const runs = automations.reduce((sum, a) => sum + a.runs24h, 0);
    return { active, errors, runs, total: automations.length };
  }, [automations]);

  return (
    <div className="flex min-h-full flex-col px-4 py-5 sm:px-6">
      {/* in-page section header */}
      <Reveal className="mb-5" y={6}>
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Automation layer
            </div>
            <h1 className="mt-1 text-base font-semibold tracking-tight text-foreground sm:text-xl">
              Integrations
            </h1>
          </div>
          <Button data-track="automation_new" className="gap-1.5">
            <Plus className="h-4 w-4" aria-hidden />
            New automation
          </Button>
        </div>
      </Reveal>

      {/* n8n connection status */}
      <Reveal delay={0.04}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl bg-card px-4 py-3.5 ring-1 ring-foreground/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Workflow className="h-[18px] w-[18px]" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13.5px] font-semibold text-foreground">n8n</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-transparent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                Connected
              </span>
            </div>
            <div className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
              {N8N_BASE_URL}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-5">
            <Stat label="Active" value={`${stats.active}/${stats.total}`} />
            <Stat label="Runs · 24h" value={stats.runs.toLocaleString("en-US")} />
            <Stat
              label="Errors"
              value={String(stats.errors)}
              tone={stats.errors > 0 ? "alert" : "default"}
            />
            <a
              href={N8N_BASE_URL}
              target="_blank"
              rel="noreferrer"
              data-track="n8n_manage"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Manage</span>
            </a>
          </div>
        </div>
      </Reveal>

      {/* automation grid */}
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {automations.map((automation, i) => (
          <Reveal key={automation.id} delay={0.08 + 0.04 * i} className="h-full">
            <AutomationCard automation={automation} onToggle={toggle} />
          </Reveal>
        ))}
      </div>

      <Footer />
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "alert";
}) {
  return (
    <div className="text-right">
      <div
        className={cn(
          "tnum font-mono text-sm font-semibold",
          tone === "alert" ? "text-destructive" : "text-foreground",
        )}
      >
        {value}
      </div>
      <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
