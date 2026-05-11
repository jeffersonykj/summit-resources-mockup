"use client";

import { Plus, Filter, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusPill } from "@/components/tables/status-pill";
import { FilterChips } from "@/components/tables/filter-chips";
import { workOrders } from "@/lib/mock-data";

const demo = (msg: string) => () =>
  toast(msg, { description: "Demo only — would run in production." });

export default function WorkOrdersPage() {
  return (
    <div className="space-y-5">
      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Open Work Orders", value: "5", trend: "+1 this week" },
          { label: "In outreach", value: "2", trend: "9 awaiting reply" },
          { label: "Live this week", value: "1", trend: "WO101 — Sydney" },
          { label: "Completed YTD", value: "23", trend: "$487k revenue" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="text-[11px] uppercase tracking-wider text-ink-muted">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold text-ink">{s.value}</div>
            <div className="mt-1 text-[11px] text-ink-muted">{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Filters & action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          options={[
            { label: "All", count: 6 },
            { label: "Draft", count: 1 },
            { label: "Outreach", count: 2 },
            { label: "Hiring", count: 1 },
            { label: "Live", count: 1 },
            { label: "Completed", count: 1 },
          ]}
        />
        <div className="flex items-center gap-2 overflow-x-auto">
          <Button variant="secondary" size="sm" onClick={demo("Open filters")}>
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>
          <Button variant="secondary" size="sm" onClick={demo("Sort by...")}>
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort
          </Button>
          <Button size="sm" onClick={demo("Create new Work Order")}>
            <Plus className="h-3.5 w-3.5" />
            New Work Order
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <THead>
          <tr>
            <TH className="w-20">ID</TH>
            <TH>Client / Project</TH>
            <TH className="w-20">State</TH>
            <TH className="w-28">Status</TH>
            <TH className="w-40">Dates</TH>
            <TH className="w-36">Staffing</TH>
            <TH className="w-16" />
          </tr>
        </THead>
        <TBody>
          {workOrders.map((wo) => (
            <TR key={wo.id} interactive onClick={demo(`Open ${wo.id} detail`)}>
              <TD className="font-medium text-accent-500">{wo.id}</TD>
              <TD>
                <div className="font-medium text-ink">{wo.project}</div>
                <div className="text-[11px] text-ink-muted">{wo.client}</div>
              </TD>
              <TD>
                <span className="text-[11px] font-medium text-ink-muted">{wo.state}</span>
              </TD>
              <TD>
                <StatusPill status={wo.status} />
              </TD>
              <TD>
                <div className="text-[12px] text-ink">{wo.startDate}</div>
                <div className="text-[11px] text-ink-muted">→ {wo.endDate}</div>
              </TD>
              <TD>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-ink">
                    {wo.hired} / {wo.required}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-subtle">
                    <div
                      className="h-full bg-accent-500"
                      style={{ width: `${(wo.hired / wo.required) * 100}%` }}
                    />
                  </div>
                </div>
              </TD>
              <TD className="text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    demo(`Start outreach for ${wo.id}`)();
                  }}
                  className="text-[11px] font-medium text-accent-500 hover:text-accent-600"
                >
                  Outreach →
                </button>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
