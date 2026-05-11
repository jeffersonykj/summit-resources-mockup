import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-subtle text-ink-muted border-border",
        accent: "bg-accent-50 text-accent-700 border-accent-200 dark:text-accent-300 dark:border-accent-900",
        success: "bg-success/10 text-success border-success/30",
        warning: "bg-warning/10 text-warning border-warning/30",
        danger: "bg-danger/10 text-danger border-danger/30",
        info: "bg-info/10 text-info border-info/30",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
