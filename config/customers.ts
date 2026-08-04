import { CUSTOMER_TAG_LABELS } from "@/lib/customers/data";
import { type AppIcon, Flag, Target, Users } from "@/lib/icons";
import type { CustomerTag } from "@/types/customer";

export const CUSTOMER_TAG_OPTIONS: Array<{
  value: CustomerTag;
  label: string;
  icon: AppIcon;
}> = (Object.keys(CUSTOMER_TAG_LABELS) as CustomerTag[]).map((value) => ({
  value,
  label: CUSTOMER_TAG_LABELS[value],
  icon:
    value === "hot-lead" || value === "vip" || value === "prospect"
      ? Target
      : value === "enterprise" || value === "smb" || value === "mining"
        ? Users
        : Flag,
}));

export const CUSTOMER_TAG_CLASS: Record<CustomerTag, string> = {
  enterprise: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  smb: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "hot-lead": "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  vip: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "churn-risk": "bg-red-500/10 text-red-700 dark:text-red-300",
  new: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  mining: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
  prospect: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  tender: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  inactive: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};
