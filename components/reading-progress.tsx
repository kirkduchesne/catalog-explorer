'use client';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useReadingList } from './reading-provider';
import { Progress } from '@/components/ui/progress';
import { catalog } from '@/lib/catalog';
import { detailUrl } from '@/lib/navigation';
import { nextUnread } from '@/lib/reading-next';

// Compact progress for the home shelf; stays quiet until something is saved.
export function ReadingProgress() {
  const { entries, ready } = useReadingList();
  if (!ready || !entries.length)
    return (
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
        Save a note to fold its corner and start a reading list. It stays in
        this browser.
      </p>
    );
  const read = entries.filter((entry) => entry.read).length;
  const next = nextUnread(entries);
  const title = catalog.find((entry) => entry.id === next)?.title;
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium">Your progress</span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {read}/{entries.length} read
        </span>
      </div>
      <Progress
        value={(read / entries.length) * 100}
        aria-label="Saved references read"
      />
      {next && title ? (
        <a
          href={detailUrl(next, '/reading-list')}
          className="group flex items-center justify-between gap-3 rounded-lg border bg-background/60 px-3 py-2 text-sm text-foreground no-underline transition-colors hover:border-foreground/40"
        >
          <span className="min-w-0">
            <span className="block font-mono text-[11px] text-muted-foreground">
              Up next
            </span>
            <span className="block truncate font-medium">
              Continue with {title}
            </span>
          </span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
          />
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">
          Every saved note is read. Fold a few more corners.
        </p>
      )}
    </div>
  );
}
