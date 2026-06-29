/**
 * n8n automation registry for the Integrations surface.
 *
 * These are the workflows the Lead Desk hands off to n8n. Each entry maps to a
 * single n8n workflow reachable from `N8N_BASE_URL`. Swap this module for a live
 * fetch against the n8n REST API (`/workflows`) when wiring the backend — the
 * shapes below mirror the fields that surface returns.
 */

/** Base URL of the n8n instance these automations live on. */
export const N8N_BASE_URL = "https://apmg.app.n8n.cloud";

export type TriggerKind = "webhook" | "schedule" | "event";
export type AutomationStatus = "active" | "paused" | "error";

export interface Automation {
  id: string;
  /** n8n workflow id — used to deep-link into the editor */
  workflowId: string;
  name: string;
  description: string;
  trigger: TriggerKind;
  /** webhook path or cron caption, shown under the trigger badge */
  triggerDetail: string;
  status: AutomationStatus;
  /** successful executions in the trailing 24h */
  runs24h: number;
  /** rolling success rate, 0–100 */
  successRate: number;
  /** relative time label of the most recent execution */
  lastRun: string;
}

export const AUTOMATIONS: Automation[] = [
  {
    id: "auto-lead-router",
    workflowId: "wf_001",
    name: "Lead intake router",
    description:
      "New lead webhook → enrich → score → write to CRM and ping the owner in Slack.",
    trigger: "webhook",
    triggerDetail: "/webhook/lead-intake",
    status: "active",
    runs24h: 184,
    successRate: 99,
    lastRun: "2m ago",
  },
  {
    id: "auto-nurture",
    workflowId: "wf_002",
    name: "Nurture drip",
    description:
      "Sends the day-0/3/7 sequence to contacted leads that haven't replied.",
    trigger: "schedule",
    triggerDetail: "Every hour",
    status: "active",
    runs24h: 24,
    successRate: 100,
    lastRun: "18m ago",
  },
  {
    id: "auto-qualified-handoff",
    workflowId: "wf_003",
    name: "Qualified hand-off",
    description:
      "On status → qualified, books a slot and creates the deal in the pipeline.",
    trigger: "event",
    triggerDetail: "lead.qualified",
    status: "active",
    runs24h: 37,
    successRate: 97,
    lastRun: "41m ago",
  },
  {
    id: "auto-dedupe",
    workflowId: "wf_004",
    name: "Dedupe sweep",
    description:
      "Nightly pass that merges duplicate leads by email + company domain.",
    trigger: "schedule",
    triggerDetail: "Daily · 03:00",
    status: "paused",
    runs24h: 0,
    successRate: 100,
    lastRun: "Yesterday",
  },
  {
    id: "auto-form-sync",
    workflowId: "wf_005",
    name: "Form → sheet sync",
    description:
      "Mirrors landing-page form submissions into the ops spreadsheet.",
    trigger: "webhook",
    triggerDetail: "/webhook/form-sync",
    status: "error",
    runs24h: 12,
    successRate: 71,
    lastRun: "3h ago",
  },
  {
    id: "auto-weekly-digest",
    workflowId: "wf_006",
    name: "Weekly digest",
    description:
      "Compiles the lead summary and emails it to the team every Monday.",
    trigger: "schedule",
    triggerDetail: "Mon · 08:00",
    status: "active",
    runs24h: 0,
    successRate: 100,
    lastRun: "3d ago",
  },
];
