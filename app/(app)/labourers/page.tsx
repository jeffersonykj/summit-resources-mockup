"use client";

import { Plus, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FilterChips } from "@/components/tables/filter-chips";
import { labourers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const demo = (msg: string) => () =>
  toast(msg, { description: "Demo only — would run in production." });

const licenceTone = {
  valid: "success",
  expiring: "warning",
  expired: "danger",
} as const;

export default function LabourersPage() {
  return (
    <div className="space-y-5">
      <FilterChips
        options={[
          { label: "Active", count: 9 },
          { label: "Archive", count: 1 },
          { label: "Expiring 30d", count: 3 },
          { label: "No rating", count: 0 },
        ]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
          <input
            placeholder="Search name, phone, email..."
            className="h-9 w-full rounded border border-border bg-surface pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Button variant="secondary" size="sm" onClick={demo("Bulk action menu")}>
            Bulk actions
          </Button>
          <Button size="sm" onClick={demo("Add new labourer")}>
            <Plus className="h-3.5 w-3.5" />
            New labourer
          </Button>
        </div>
      </div>

      <Table>
        <THead>
          <tr>
            <TH>Name</TH>
            <TH className="w-16">State</TH>
            <TH>Skills</TH>
            <TH>Licences</TH>
            <TH className="w-24">Rating</TH>
            <TH className="w-32">Last contacted</TH>
            <TH className="w-32" />
          </tr>
        </THead>
        <TBody>
          {labourers.map((l) => (
            <TR key={l.id} interactive onClick={demo(`Open ${l.name}`)}>
              <TD>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-100 text-[11px] font-semibold text-accent-700 dark:bg-accent-900 dark:text-accent-300">
                    {l.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="leading-tight">
                    <div className="font-medium text-ink">{l.name}</div>
                    <div className="text-[11px] text-ink-muted">{l.id}</div>
                  </div>
                </div>
              </TD>
              <TD>
                <span className="text-[11px] font-medium text-ink-muted">{l.state}</span>
              </TD>
              <TD>
                <div className="flex flex-wrap gap-1">
                  {l.skills.map((s) => (
                    <Badge key={s} tone="accent">
                      {s}
                    </Badge>
                  ))}
                </div>
              </TD>
              <TD>
                <div className="flex flex-wrap gap-1">
                  {l.licences.map((lic) => (
                    <Badge key={lic.name} tone={licenceTone[lic.status]}>
                      {lic.name}
                    </Badge>
                  ))}
                </div>
              </TD>
              <TD>
                <div className="flex items-center gap-1">
                  <Star
                    className={cn(
                      "h-3.5 w-3.5",
                      l.rating >= 4.5 ? "fill-warning text-warning" : "fill-ink-muted/40 text-ink-muted/40"
                    )}
                  />
                  <span className="font-medium text-ink">{l.rating.toFixed(1)}</span>
                </div>
              </TD>
              <TD>
                <span className="text-[12px] text-ink-muted">{l.lastContacted}</span>
              </TD>
              <TD className="text-right">
                {l.active ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      demo(`Send profile-update prompt to ${l.name}`)();
                    }}
                    className="text-[11px] font-medium text-accent-500 hover:text-accent-600"
                  >
                    Send prompt →
                  </button>
                ) : (
                  <span className="text-[11px] font-medium text-ink-muted">Inactive</span>
                )}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
