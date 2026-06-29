import {
  Activity,
  Filter,
  LayoutDashboard,
  Megaphone,
  Radio,
  Settings,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type TabId =
  | "overview"
  | "pipeline"
  | "sources"
  | "campaigns"
  | "integrations"
  | "telemetry"
  | "settings";

export interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  caption: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    caption: "Monitor",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "pipeline", label: "Pipeline", icon: Filter, badge: "312" },
      { id: "sources", label: "Sources", icon: Radio, badge: "6" },
      { id: "campaigns", label: "Campaigns", icon: Megaphone, badge: "4" },
    ],
  },
  {
    caption: "Automate",
    items: [
      { id: "integrations", label: "Integrations", icon: Workflow },
    ],
  },
  {
    caption: "System",
    items: [
      { id: "telemetry", label: "Telemetry", icon: Activity },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export const TAB_LABEL: Record<TabId, string> = {
  overview: "Overview",
  pipeline: "Pipeline",
  sources: "Sources",
  campaigns: "Campaigns",
  integrations: "Integrations",
  telemetry: "Telemetry",
  settings: "Settings",
};
