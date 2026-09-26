import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
} from '@/components/icons';
import { BookmarkButton } from '@/components/bookmark-button';
import { ReadingProgress } from '@/components/reading-progress';
import { LevelBadge, TopicBadge, topicDot } from '@/components/topic-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { detailUrl } from '@/lib/navigation';
import { ActiveFilters } from '@/components/active-filters';
import { catalog, categories } from '@/lib/catalog';
import { pageUrl, results, type Params } from '@/lib/query';
import { SearchForm } from '@/components/search-form';
import { cn } from '@/lib/utils';
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const { query } = results(await searchParams);
  const filters = [query.q, query.category, query.level]
    .filter(Boolean)
    .join(' · ');
  const filtered = Boolean(
    filters ||
      query.sort !== 'default' ||
      query.mode !== 'phrase' ||
      query.size !== 6 ||
      query.page !== 1,
  );
  return {
    robots: { index: !filtered, follow: true },
    title: filters ? `${filters} | Dogear` : 'Dogear — notes for everyday code',
    description: filters
      ? `Programming references matching ${filters}.`
      : 'Short, authored notes on everyday programming. Fold the corner on the ones you want to read next.',
  };
}
const pageLink =
  'inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-md border bg-card px-3 text-sm font-medium text-foreground no-underline shadow-sm transition-colors hover:border-foreground/40 hover:bg-accent';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const { query, entries, count, pages, facets, start, end, pageAdjusted } =
    results(await searchParams);
  return (
    <main id="main-content" className="container max-w-6xl pt-10 sm:pt-16">
      <section className="grid items-end gap-8 lg:grid-cols-[1fr_22rem]">
        <header className="animate-fade-up">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 font-mono text-xs text-muted-foreground shadow-sm">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
            A programming reference shelf
          </p>
          <h1 className="font-serif text-[2.6rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl">
            Short notes for{' '}
            <em className="font-medium text-brand-ink">everyday</em> code.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Browse short, authored notes on everyday programming concepts.
            Fold the corner on the ones worth coming back to.
          </p>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Browse by topic" role="group">
            {categories.map((topic) => (
              <a
                key={topic}
                href={`/?category=${encodeURIComponent(topic)}#results`}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium text-foreground no-underline shadow-sm transition-all hover:-translate-y-px hover:border-foreground/40 hover:shadow-paper"
              >
                <span aria-hidden="true" className={cn('size-2 rounded-full', topicDot(topic))} />
                {topic}
                <span className="font-mono text-xs text-muted-foreground">
                  {catalog.filter((entry) => entry.category === topic).length}
                </span>
              </a>
            ))}
          </div>
        </header>
        <Card className="animate-fade-up p-5 [animation-delay:120ms]">
          <dl className="mb-5 grid grid-cols-3 divide-x text-center">
            {[
              [catalog.length, 'notes'],
              [categories.length, 'topics'],
              [0, 'accounts'],
            ].map(([value, label]) => (
              <div key={label} className="px-2">
                <dt className="sr-only">{label}</dt>
                <dd className="font-serif text-3xl font-semibold tabular-nums">
                  {value}
                </dd>
                <dd aria-hidden="true" className="font-mono text-[11px] text-muted-foreground">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
          <ReadingProgress />
        </Card>
      </section>
      <section aria-label="Search the shelf" className="mt-12">
        <SearchForm query={query} facets={facets} />
        <ActiveFilters query={query} />
      </section>
      <div
        id="results"
        tabIndex={-1}
        className="mb-5 mt-10 flex scroll-mt-24 flex-wrap items-end justify-between gap-3 border-b pb-4"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-serif text-2xl font-semibold text-foreground">
            {count} {count === 1 ? 'note' : 'notes'} found
          </span>{' '}
          · Showing {start}–{end}
        </p>
        <Button asChild variant="ghost" size="sm">
          <a href="/">Clear filters</a>
        </Button>
      </div>
      {pageAdjusted ? (
        <p className="mb-5 rounded-lg border border-dashed bg-card/60 px-4 py-3 text-sm">
          That page is outside these results. Showing the last available page.
        </p>
      ) : null}
      {!count ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card/60 px-6 py-14 text-center">
          <SearchX aria-hidden="true" className="mb-4 size-10 text-muted-foreground" />
          <p className="max-w-sm font-serif text-xl font-semibold">
            No notes match these filters. Try a broader search or clear the
            filters.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {query.q ? (
              <Button asChild variant="outline" size="sm">
                <a href={pageUrl({ ...query, q: '' }, 1)}>
                  Try without the search text
                </a>
              </Button>
            ) : null}
            {query.category ? (
              <Button asChild variant="outline" size="sm">
                <a href={pageUrl({ ...query, category: '' }, 1)}>
                  Try all topics
                </a>
              </Button>
            ) : null}
            {query.level ? (
              <Button asChild variant="outline" size="sm">
                <a href={pageUrl({ ...query, level: '' }, 1)}>Try all levels</a>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, index) => (
          <li
            key={entry.id}
            style={{ animationDelay: `${index * 40}ms` }}
            className="dogear group flex animate-fade-up flex-col rounded-xl border bg-card p-5 shadow-paper hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-lift"
          >
            <div className="flex flex-wrap items-center gap-3 pr-6">
              <TopicBadge topic={entry.category} />
              <LevelBadge level={entry.level} />
            </div>
            <h2 className="mt-4 font-serif text-xl font-semibold leading-snug tracking-tight">
              <a
                href={detailUrl(entry.id, pageUrl(query, query.page))}
                className="text-foreground no-underline after:absolute after:inset-0 after:rounded-xl after:content-[''] hover:text-brand-ink"
              >
                {entry.title}
              </a>
            </h2>
            <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">
              {entry.summary}
            </p>
            <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4">
              <BookmarkButton id={entry.id} title={entry.title} />
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </div>
          </li>
        ))}
      </ul>
      <nav
        aria-label="Results pages"
        className="mt-10 flex flex-wrap items-center justify-center gap-2"
      >
        {query.page > 2 ? (
          <a className={pageLink} href={pageUrl(query, 1)}>
            <ChevronsLeft aria-hidden="true" className="size-4" />
            First page
          </a>
        ) : null}
        {query.page > 1 ? (
          <a
            aria-label="Previous result page"
            className={pageLink}
            href={pageUrl(query, query.page - 1)}
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            Previous
          </a>
        ) : null}
        {Array.from({ length: pages }, (_, index) => index + 1).map((page) => (
          <a
            key={page}
            href={pageUrl(query, page)}
            aria-current={page === query.page ? 'page' : undefined}
            aria-label={`Page ${page}`}
            className={cn(
              pageLink,
              'font-mono tabular-nums aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground',
            )}
          >
            {page}
          </a>
        ))}
        {query.page < pages ? (
          <a
            aria-label="Next result page"
            className={pageLink}
            href={pageUrl(query, query.page + 1)}
          >
            Next
            <ChevronRight aria-hidden="true" className="size-4" />
          </a>
        ) : null}
        {query.page < pages - 1 ? (
          <a className={pageLink} href={pageUrl(query, pages)}>
            Last page
            <ChevronsRight aria-hidden="true" className="size-4" />
          </a>
        ) : null}
        <span className="w-full text-center font-mono text-xs text-muted-foreground">
          Page {query.page} of {pages}
        </span>
      </nav>
    </main>
  );
}
