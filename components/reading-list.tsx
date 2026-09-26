'use client';
import {
  ArrowRight,
  BookmarkPlus,
  Check,
  Circle,
  CircleCheck,
  Download,
  Eraser,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { nextUnread } from '@/lib/reading-next';
import { downloadReading } from '@/lib/reading-download';
import { sortReading } from '@/lib/reading-sort';
import { useRef, useState } from 'react';
import { filterReading, type ReadingFilter } from '@/lib/reading-query';
import { useReadingList } from './reading-provider';
import { LevelBadge, TopicBadge } from '@/components/topic-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { catalog } from '@/lib/catalog';
import { detailUrl } from '@/lib/navigation';
import { removeReference, setRead } from '@/lib/reading-actions';
import { cn } from '@/lib/utils';
export function ReadingList() {
  const [exportMessage, setExportMessage] = useState('');
  const list = useRef<HTMLUListElement>(null);
  const { entries, ready, write, allowed } = useReadingList();
  const [status, setStatus] = useState<ReadingFilter>('all');
  const searchInput = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [sort, setSort] = useState<'saved' | 'title'>('saved');
  const visible = sortReading(filterReading(entries, status, search), sort);
  function focusRow(index: number) {
    requestAnimationFrame(() => {
      const links = list.current?.querySelectorAll('a');
      if (links?.length)
        (links[Math.min(index, links.length - 1)] as HTMLElement).focus();
      else searchInput.current?.focus();
    });
  }
  if (!ready)
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Reading list is unavailable or loading. Catalog browsing remains
          available.
        </p>
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  const readCount = entries.filter((entry) => entry.read).length;
  const next = nextUnread(visible);
  const nextTitle = catalog.find((entry) => entry.id === next)?.title;
  return (
    <section aria-label="Saved references" className="space-y-6">
      <Card className="grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div className="min-w-0 space-y-3">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-serif text-4xl font-semibold tabular-nums">
              {entries.length ? Math.round((readCount / entries.length) * 100) : 0}
              <span className="text-2xl text-muted-foreground">%</span>
            </span>
            <span className="text-sm text-muted-foreground">
              {readCount} read of {entries.length} saved ·{' '}
              {entries.length - readCount} remaining
            </span>
          </p>
          <Progress
            value={entries.length ? (readCount / entries.length) * 100 : 0}
            aria-label="Saved references read"
          />
        </div>
        {next ? (
          <Button asChild variant="brand" className="h-auto min-h-11 whitespace-normal py-2 text-left">
            <a href={detailUrl(next, '/reading-list')}>
              <span className="flex flex-col">
                <span>Open next unread reference</span>
                <span
                  aria-hidden="true"
                  className="max-w-[16rem] truncate text-xs font-normal opacity-80"
                >
                  {nextTitle}
                </span>
              </span>
              <ArrowRight aria-hidden="true" />
            </a>
          </Button>
        ) : null}
      </Card>
      <Card className="p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="mb-0 min-w-0">
            <span className="mb-2 block">Search saved titles or topics</span>
            <span className="relative block">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                ref={searchInput}
                type="search"
                className="pl-9"
                value={search}
                onChange={(event) =>
                  setSearch(
                    Array.from(event.target.value).slice(0, 100).join(''),
                  )
                }
              />
            </span>
          </label>
          <label className="mb-0 min-w-0">
            <span className="mb-2 block">Reading status</span>
            <NativeSelect
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ReadingFilter)
              }
            >
              <option value="all">All saved</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </NativeSelect>
          </label>
          <label className="mb-0 min-w-0">
            <span className="mb-2 block">Sort saved references</span>
            <NativeSelect
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as 'saved' | 'title')
              }
            >
              <option value="saved">Recently saved</option>
              <option value="title">Title A–Z</option>
            </NativeSelect>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('');
              setStatus('all');
              setSort('saved');
              searchInput.current?.focus();
            }}
          >
            <RotateCcw aria-hidden="true" />
            Reset reading filters
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!visible.length}
            onClick={() => {
              try {
                downloadReading(visible, allowed);
                setExportMessage('Visible references download requested.');
              } catch {
                setExportMessage(
                  'Download failed. Saved references are unchanged.',
                );
              }
            }}
          >
            <Download aria-hidden="true" />
            Download visible references
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="sm:ml-auto"
            disabled={!entries.some((entry) => entry.read)}
            onClick={() => setConfirmClear(true)}
          >
            <Eraser aria-hidden="true" />
            Clear read references
          </Button>
        </div>
        {confirmClear ? (
          <div
            role="group"
            aria-label="Confirm clearing read references"
            className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3"
          >
            <p className="flex-1 text-sm font-medium">
              Remove all read references from this browser?
            </p>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => {
                if (
                  write(
                    entries.filter((entry) => !entry.read),
                    'Read references removed.',
                  )
                ) {
                  setConfirmClear(false);
                  searchInput.current?.focus();
                }
              }}
            >
              Confirm clear read
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setConfirmClear(false)}
            >
              Cancel clear
            </Button>
          </div>
        ) : null}
        <p role="status" className="text-sm text-muted-foreground empty:hidden [&:not(:empty)]:mt-3">
          {exportMessage}
        </p>
      </Card>
      <p className="font-mono text-xs text-muted-foreground">
        {visible.length} saved references shown
      </p>
      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card/60 px-6 py-14 text-center">
          <BookmarkPlus
            aria-hidden="true"
            className="mb-4 size-10 text-muted-foreground"
          />
          <p className="max-w-sm font-serif text-xl font-semibold">
            {entries.length
              ? 'No saved references match these filters.'
              : 'Your reading list is empty. Browse the catalog and save a reference.'}
          </p>
        </div>
      ) : (
        <ul ref={list} className="space-y-3">
          {visible.map((saved, index) => {
            const item = catalog.find((entry) => entry.id === saved.id)!;
            return (
              <li
                key={saved.id}
                className={cn(
                  'group flex gap-4 rounded-xl border bg-card p-4 shadow-paper transition-colors sm:p-5',
                  saved.read && 'bg-card/60',
                )}
              >
                {saved.read ? (
                  <CircleCheck
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  />
                ) : (
                  <Circle
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-brand"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <a
                    className={cn(
                      'font-serif text-lg font-semibold leading-snug text-foreground no-underline hover:text-brand-ink hover:underline',
                      saved.read && 'text-muted-foreground',
                    )}
                    href={detailUrl(item.id, '/reading-list')}
                  >
                    {item.title}
                  </a>
                  <p className="mt-1.5 flex flex-wrap items-center gap-3">
                    <TopicBadge topic={item.category} />
                    <LevelBadge level={item.level} />
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={saved.read ? 'secondary' : 'outline'}
                      aria-pressed={saved.read}
                      onClick={() => {
                        if (
                          write(
                            setRead(entries, item.id, !saved.read),
                            saved.read
                              ? `Marked ${item.title} unread.`
                              : `Marked ${item.title} read.`,
                          ) &&
                          status !== 'all'
                        )
                          focusRow(index);
                      }}
                    >
                      {saved.read ? (
                        <Circle aria-hidden="true" />
                      ) : (
                        <Check aria-hidden="true" />
                      )}
                      {saved.read ? 'Mark unread' : 'Mark read'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        if (
                          write(
                            removeReference(entries, item.id),
                            `Removed ${item.title}.`,
                          )
                        )
                          focusRow(index);
                      }}
                    >
                      <Trash2 aria-hidden="true" />
                      Remove <span className="sr-only">{item.title}</span>
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
