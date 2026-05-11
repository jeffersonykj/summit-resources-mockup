"use client";

import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shell/theme-toggle";

const titles: Record<string, string> = {
  "/work-orders": "Work Orders",
  "/labourers": "Labourers",
  "/hiring": "Hiring Log",
  "/activity": "System Activity",
};

const subtitles: Record<string, string> = {
  "/work-orders": "Manage active and historical jobs",
  "/labourers": "Your full labour database",
  "/hiring": "Contract status across all hires",
  "/activity": "Failures and events that need attention",
};

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Summit Resources";
  const subtitle = subtitles[pathname] ?? "";

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          aria-label="Open menu"
          className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded text-ink-muted hover:bg-subtle hover:text-ink md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="min-w-0 leading-tight">
          <h1 className="truncate text-[15px] font-semibold text-ink">{title}</h1>
          {subtitle && <p className="hidden truncate text-[11px] text-ink-muted sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search Work Orders, labourers..."
            className="h-8 w-72 rounded border border-border bg-subtle/50 pl-8 pr-3 text-[13px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
        <div className="flex items-center">
          <button
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded text-ink-muted hover:bg-subtle hover:text-ink"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
