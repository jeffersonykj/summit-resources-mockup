"use client";

import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusPill } from "@/components/tables/status-pill";
import { FilterChips } from "@/components/tables/filter-chips";
import { hiringEntries } from "@/lib/mock-data";

const demo = (msg: string) => () =>
  toast(msg, { description: "Demo only — would run in production." });

export default function HiringPage() {
  return (
    <div className="space-y-5">
      <FilterChips
        options={[
          { label: "All", count: 7 },
          { label: "Created", count: 1 },
          { label: "Sent", count: 3 },
          { label: "Signed", count: 2 },
          { label: "Rejected", count: 1 },
        ]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[12px] text-ink-muted">7 contracts across 4 Work Orders</div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Button variant="secondary" size="sm" onClick={demo("Export hiring log")}>
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" onClick={demo("Generate contract")}>
            <FileText className="h-3.5 w-3.5" />
            Generate contract
          </Button>
        </div>
      </div>

      <Table>
        <THead>
          <tr>
            <TH>Labourer</TH>
            <TH>Work Order</TH>
            <TH className="w-28">Status</TH>
            <TH className="w-32">Sent</TH>
            <TH className="w-32">Signed</TH>
            <TH className="w-32" />
          </tr>
        </THead>
        <TBody>
          {hiringEntries.map((h) => (
            <TR key={h.id} interactive onClick={demo(`Open ${h.id} contract`)}>
              <TD className="font-medium text-ink">{h.labourerName}</TD>
              <TD>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-accent-500">{h.workOrderId}</span>
                  <span className="text-[12px] text-ink-muted">{h.workOrderProject}</span>
                </div>
              </TD>
              <TD>
                <StatusPill status={h.status} variant="contract" />
              </TD>
              <TD>
                <span className="text-[12px] text-ink">{h.sentDate}</span>
              </TD>
              <TD>
                <span className="text-[12px] text-ink">{h.signedDate ?? "—"}</span>
              </TD>
              <TD className="text-right">
                {h.status === "Signed" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      demo("Download contract PDF")();
                    }}
                    className="text-[11px] font-medium text-accent-500 hover:text-accent-600"
                  >
                    Download PDF →
                  </button>
                ) : h.status === "Sent" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      demo("Check Adobe Sign status")();
                    }}
                    className="text-[11px] font-medium text-accent-500 hover:text-accent-600"
                  >
                    Check status →
                  </button>
                ) : null}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
