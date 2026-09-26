'use client';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useReadingList } from './reading-provider';
import { Button } from '@/components/ui/button';
import { saveReference, removeReference } from '@/lib/reading-actions';
import { cn } from '@/lib/utils';
export function BookmarkButton({
  id,
  title,
  className,
}: {
  id: number;
  title: string;
  className?: string;
}) {
  const { entries, ready, write, error } = useReadingList();
  const saved = entries.some((entry) => entry.id === id);
  return (
    <div className={cn('relative z-10', className)} data-saved={saved}>
      <Button
        type="button"
        size="sm"
        variant={saved ? 'secondary' : 'outline'}
        disabled={!ready}
        aria-pressed={saved}
        className={cn(saved && 'text-brand-ink')}
        onClick={() =>
          write(
            saved
              ? removeReference(entries, id)
              : saveReference(entries, id, new Date().toISOString()),
            saved ? `Removed ${title}.` : `Saved ${title}.`,
          )
        }
      >
        {saved ? (
          <BookmarkCheck aria-hidden="true" className="fill-brand/20" />
        ) : (
          <Bookmark aria-hidden="true" />
        )}
        {saved ? 'Remove from reading list' : 'Save to reading list'}
      </Button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
