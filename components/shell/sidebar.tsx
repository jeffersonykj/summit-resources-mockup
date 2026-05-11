"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Briefcase, FileSignature, Mountain, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/work-orders", label: "Work Orders", icon: Briefcase },
  { href: "/labourers", label: "Labourers", icon: Users },
  { href: "/hiring", label: "Hiring", icon: FileSignature },
  { href: "/activity", label: "Activity", icon: Bell, badge: 3 },
];

export function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onMobileClose}
        aria-hidden
      />

      <aside
        className={cn(
          "flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface",
          "fixed inset-y-0 left-0 z-40 transition-transform duration-200 ease-out",
          "md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 px-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-accent-500 text-white">
              <Mountain className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold tracking-tight text-ink">Summit Resources</div>
              <div className="text-[10px] uppercase tracking-wider text-ink-muted">Operator Console</div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="-mr-2 flex h-8 w-8 items-center justify-center rounded text-ink-muted hover:bg-subtle hover:text-ink md:hidden"
            onClick={onMobileClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="px-2 pb-2 text-[10px] font-medium uppercase tracking-wider text-ink-muted">
            Workspace
          </div>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "group relative flex h-9 items-center gap-2.5 rounded px-2.5 text-[13px] font-medium transition-colors",
                      active
                        ? "bg-accent-50 text-accent-700 dark:bg-accent-100/40 dark:text-accent-300"
                        : "text-ink-muted hover:bg-subtle hover:text-ink"
                    )}
                  >
                    {active && (
                      <span className="absolute -left-3 top-1.5 h-6 w-0.5 rounded-r bg-accent-500" />
                    )}
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-danger px-1.5 text-[10px] font-medium leading-4 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 rounded px-2 py-1.5 hover:bg-subtle">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-[11px] font-semibold text-white">
              JS
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-[13px] font-medium text-ink">Joshua Shields</div>
              <div className="truncate text-[11px] text-ink-muted">Owner</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
