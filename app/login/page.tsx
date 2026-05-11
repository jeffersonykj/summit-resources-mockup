"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mountain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shell/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => router.push("/work-orders"), 250);
  };

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center bg-background px-6">
      {/* Top-right utilities */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 sm:right-6 sm:top-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-2.5 py-1 text-[11px] font-medium text-accent-700 dark:border-accent-900 dark:bg-accent-950 dark:text-accent-300">
          <Sparkles className="h-3 w-3" />
          Demo build
        </div>
        <ThemeToggle />
      </div>

      {/* Ambient indigo glow in dark mode only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 30%, hsl(var(--accent-700) / 0.18), transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-accent-500 text-white">
            <Mountain className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">Summit Resources</h1>
            <p className="mt-1 text-[13px] text-ink-muted">Sign in to the operator console</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-border bg-surface p-6">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[12px] font-medium text-ink">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="joshua@summit-resources.com.au"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[12px] font-medium text-ink">
                Password
              </label>
              <a href="#" className="text-[11px] text-accent-500 hover:text-accent-600">
                Forgot password?
              </a>
            </div>
            <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Continue"}
          </Button>

          <p className="text-center text-[11px] text-ink-muted">
            Single sign-on and multi-user roles in v1.
          </p>
        </form>

        <p className="mt-6 text-center text-[11px] text-ink-muted">
          This is a demo build. Any email and password will work.
        </p>
      </div>
    </div>
  );
}
