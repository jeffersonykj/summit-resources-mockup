"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function FilterChips({
  options,
  defaultValue,
}: {
  options: { label: string; count?: number }[];
  defaultValue?: string;
}) {
  const [active, setActive] = useState(defaultValue ?? options[0]?.label);

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto">
      {options.map((opt) => {
        const isActive = opt.label === active;
        return (
          <button
            key={opt.label}
            onClick={() => setActive(opt.label)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors",
              isActive
                ? "border-accent-500 bg-accent-500 text-white"
                : "border-border bg-surface text-ink-muted hover:text-ink hover:border-ink-muted/40"
            )}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px]",
                  isActive ? "bg-white/20" : "bg-subtle text-ink-muted"
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
