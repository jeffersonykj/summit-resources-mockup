"use client";

import { AlertTriangle, Info, RotateCw, XCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterChips } from "@/components/tables/filter-chips";
import { activityEntries, type ActivitySeverity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const demo = (msg: string) => () =>
  toast(msg, { description: "Demo only — would run in production." });

const severityConfig: Record<
  ActivitySeverity,
  { icon: typeof AlertTriangle; tone: "danger" | "warning" | "info"; label: string }
> = {
  error: { icon: XCircle, tone: "danger", label: "Error" },
  warning: { icon: AlertTriangle, tone: "warning", label: "Warning" },
  info: { icon: Info, tone: "info", label: "Info" },
};

export default function ActivityPage() {
  const unresolvedCount = activityEntries.filter((e) => !e.resolved).length;

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-ink">System Activity Inbox</h2>
              <Badge tone="danger">{unresolvedCount} unresolved</Badge>
            </div>
            <p className="mt-1 text-[13px] text-ink-muted max-w-2xl">
              Every failure across SMS delivery, webhooks, scheduled jobs, and PDF rendering lands here with one-click recovery. No more silent failures in Make.com.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={demo("Configure notification rules")}>
            Notifications
          </Button>
        </div>
      </div>

      <FilterChips
        options={[
          { label: "All", count: 4 },
          { label: "Errors", count: 2 },
          { label: "Warnings", count: 1 },
          { label: "Info", count: 1 },
          { label: "Resolved", count: 1 },
        ]}
      />

      <div className="space-y-2">
        {activityEntries.map((e) => {
          const conf = severityConfig[e.severity];
          const Icon = conf.icon;
          return (
            <div
              key={e.id}
              className={cn(
                "rounded-lg border bg-surface p-4 transition-colors",
                e.resolved
                  ? "border-border opacity-70"
                  : "border-border hover:border-ink-muted/40"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    e.severity === "error" && "bg-danger/10 text-danger",
                    e.severity === "warning" && "bg-warning/10 text-warning",
                    e.severity === "info" && "bg-info/10 text-info"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={conf.tone}>{conf.label}</Badge>
                    <span className="text-[11px] text-ink-muted">{e.source}</span>
                    <span className="text-[11px] text-ink-muted">·</span>
                    <span className="text-[11px] text-ink-muted">{e.timestamp}</span>
                    {e.resolved && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-success">
                        <CheckCircle2 className="h-3 w-3" />
                        Resolved
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-[13px] text-ink">{e.message}</p>

                  <div className="mt-2 flex items-center gap-3">
                    {e.entityLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="text-[11px] font-medium text-accent-500 hover:text-accent-600"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>

                  {!e.resolved && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {e.actions.map((a) => (
                        <Button
                          key={a.label}
                          size="sm"
                          variant={a.primary ? "primary" : "secondary"}
                          onClick={demo(a.label)}
                        >
                          {a.primary && a.label === "Retry" && <RotateCw className="h-3 w-3" />}
                          {a.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
