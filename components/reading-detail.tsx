'use client';
import { ArrowRight, Check, Circle } from 'lucide-react';
import { useReadingList } from './reading-provider';
import { Button } from '@/components/ui/button';
import { nextUnread } from '@/lib/reading-next';
import { detailUrl } from '@/lib/navigation';
import { setRead } from '@/lib/reading-actions';
export function ReadingDetail({ id }: { id: number }) {
  const { entries, ready, write } = useReadingList();
  const saved = entries.find((entry) => entry.id === id);
  if (!ready || !saved) return null;
  const next = nextUnread(entries, id);
  return (
    <aside
      className="flex flex-wrap items-center gap-3"
      aria-label="Saved reading progress"
    >
      <Button
        type="button"
        size="sm"
        variant={saved.read ? 'secondary' : 'default'}
        aria-pressed={saved.read}
        onClick={() =>
          write(
            setRead(entries, id, !saved.read),
            saved.read ? 'Marked unread.' : 'Marked read.',
          )
        }
      >
        {saved.read ? (
          <Circle aria-hidden="true" />
        ) : (
          <Check aria-hidden="true" />
        )}
        {saved.read ? 'Mark unread' : 'Mark read'}
      </Button>
      {next ? (
        <Button asChild size="sm" variant="ghost">
          <a href={detailUrl(next, '/reading-list')}>
            Next unread saved reference
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      ) : null}
    </aside>
  );
}
