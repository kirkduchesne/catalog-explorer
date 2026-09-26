'use client';
import { useReadingList } from './reading-provider';
import { nextUnread } from '@/lib/reading-next';
import { detailUrl } from '@/lib/navigation';
import { setRead } from '@/lib/reading-actions';
export function ReadingDetail({ id }: { id: number }) {
  const { entries, ready, write } = useReadingList();
  const saved = entries.find((entry) => entry.id === id);
  if (!ready || !saved) return null;
  return (
    <aside className="my-4" aria-label="Saved reading progress">
      <button
        type="button"
        aria-pressed={saved.read}
        onClick={() =>
          write(
            setRead(entries, id, !saved.read),
            saved.read ? 'Marked unread.' : 'Marked read.',
          )
        }
      >
        {saved.read ? 'Mark unread' : 'Mark read'}
      </button>
      {nextUnread(entries, id) ? (
        <p className="mt-3">
          <a href={detailUrl(nextUnread(entries, id)!, '/reading-list')}>
            Next unread saved reference
          </a>
        </p>
      ) : null}
    </aside>
  );
}
