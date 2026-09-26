'use client';
import { usePathname } from 'next/navigation';
import { BookMarked, RotateCw, TriangleAlert } from 'lucide-react';
import { useReadingList } from './reading-provider';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Header link to the saved list, with the count read as "Reading list (n)".
export function ReadingNavLink() {
  const { entries, ready } = useReadingList();
  const current = usePathname() === '/reading-list';
  const unread = entries.filter((entry) => !entry.read).length;
  return (
    <a
      href="/reading-list"
      aria-current={current ? 'page' : undefined}
      className={cn(
        'group inline-flex h-9 items-center gap-2 rounded-full border bg-card px-3 text-sm font-medium text-foreground no-underline shadow-sm transition-colors hover:border-foreground/40 aria-[current=page]:border-foreground/60',
      )}
    >
      <BookMarked aria-hidden="true" className="size-4 text-brand" />
      Reading list
      {ready ? (
        <>
          <span className="sr-only">{` (${entries.length})`}</span>
          <span
            aria-hidden="true"
            className={cn(
              'min-w-5 rounded-full px-1.5 text-center font-mono text-[11px] leading-5 tabular-nums',
              unread
                ? 'bg-brand-ink text-white dark:bg-brand dark:text-background'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {entries.length}
          </span>
        </>
      ) : null}
    </a>
  );
}

// Live announcements and storage recovery shared by every page.
export function ReadingSummary() {
  const { error, announcement, reload } = useReadingList();
  return (
    <div className="container max-w-6xl">
      <p role="status" className="sr-only">
        {announcement}
      </p>
      {error ? (
        <Alert variant="destructive" className="mt-4 flex-wrap items-center">
          <TriangleAlert aria-hidden="true" />
          <p role="alert" className="min-w-0 flex-1">
            {error}
          </p>
          <Button type="button" size="sm" variant="outline" onClick={reload}>
            <RotateCw aria-hidden="true" />
            Reload saved list
          </Button>
        </Alert>
      ) : null}
    </div>
  );
}
