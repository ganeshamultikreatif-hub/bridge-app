import { cn } from "@/lib/utils";

interface NavMenuBadgeProps {
  className?: string;
  count: number;
}

export function NavMenuBadge({ className, count }: NavMenuBadgeProps) {
  if (count <= 0) {
    return null;
  }

  const label = count > 99 ? "99+" : String(count);
  const isWide = label.length > 1;

  return (
    <span
      className={cn(
        "ml-auto inline-flex shrink-0 items-center justify-center rounded-full bg-red-500 px-1 font-semibold leading-none text-white shadow-sm",
        isWide ? "h-4 min-w-4 text-[8.5px]" : "h-3.5 min-w-3.5 text-[9px]",
        "group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:top-0.5 group-data-[collapsible=icon]:right-0.5 group-data-[collapsible=icon]:ml-0",
        className,
      )}
    >
      {label}
    </span>
  );
}
