import { cn } from "@/lib/utils";
import type {
  WorkOrderStatus,
  ContractStatus,
} from "@/lib/mock-data";

const woMap: Record<WorkOrderStatus, string> = {
  Draft: "bg-subtle text-ink-muted border-border",
  Outreach: "bg-info/10 text-info border-info/30",
  Hiring: "bg-warning/10 text-warning border-warning/30",
  Live: "bg-success/10 text-success border-success/30",
  Completed: "bg-accent-50 text-accent-700 border-accent-200 dark:bg-accent-950 dark:text-accent-300 dark:border-accent-900",
};

const contractMap: Record<ContractStatus, string> = {
  Created: "bg-subtle text-ink-muted border-border",
  Sent: "bg-warning/10 text-warning border-warning/30",
  Signed: "bg-success/10 text-success border-success/30",
  Rejected: "bg-danger/10 text-danger border-danger/30",
};

const dotMap: Record<string, string> = {
  Draft: "bg-ink-muted/50",
  Outreach: "bg-info",
  Hiring: "bg-warning",
  Live: "bg-success",
  Completed: "bg-accent-500",
  Created: "bg-ink-muted/50",
  Sent: "bg-warning",
  Signed: "bg-success",
  Rejected: "bg-danger",
};

export function StatusPill({
  status,
  variant = "workOrder",
}: {
  status: WorkOrderStatus | ContractStatus;
  variant?: "workOrder" | "contract";
}) {
  const classes = variant === "workOrder" ? woMap[status as WorkOrderStatus] : contractMap[status as ContractStatus];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-2xs font-medium",
        classes
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotMap[status])} />
      {status}
    </span>
  );
}
