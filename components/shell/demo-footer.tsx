import { Sparkles } from "lucide-react";

export function DemoFooter() {
  return (
    <footer className="sticky bottom-0 z-10 flex h-8 shrink-0 items-center justify-center gap-2 border-t border-accent-200 bg-accent-50 px-4 text-[11px] font-medium text-accent-700 dark:border-accent-900 dark:bg-accent-950 dark:text-accent-300">
      <Sparkles className="h-3 w-3 shrink-0" />
      <span className="truncate sm:hidden">Demo build — designed for Summit Resources</span>
      <span className="hidden truncate sm:inline">
        Demo build — final functionality and content TBD. Designed for Summit Resources by Jefferson.
      </span>
    </footer>
  );
}
