import {
  type AppIcon,
  Building2Icon,
  Megaphone,
  Target,
  Users,
} from "@/lib/icons";

export interface DashboardFilterOption {
  value: string;
  label: string;
  description?: string;
  icon: AppIcon;
}

/** Global dashboard scope — applies to every widget. */
export const DASHBOARD_DEPARTMENT_OPTIONS: DashboardFilterOption[] = [
  {
    value: "marketing",
    label: "Marketing",
    description: "Campaigns & acquisition",
    icon: Megaphone,
  },
  {
    value: "sales",
    label: "Sales",
    description: "Lead follow-up & closing",
    icon: Target,
  },
  {
    value: "cs",
    label: "Customer Success",
    description: "Retention & onboarding",
    icon: Users,
  },
  {
    value: "ops",
    label: "Operations",
    description: "Ops & delivery support",
    icon: Building2Icon,
  },
];

/** Shared option lists for module pages / widget-local filters — not dashboard chrome. */
export const DASHBOARD_SALES_OPTIONS: DashboardFilterOption[] = [
  {
    value: "rina",
    label: "Rina",
    description: "Sales · Enterprise",
    icon: Users,
  },
  { value: "andi", label: "Andi", description: "Sales · SMB", icon: Users },
  {
    value: "maya",
    label: "Maya",
    description: "Customer Success",
    icon: Users,
  },
];
