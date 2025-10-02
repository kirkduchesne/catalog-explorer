import { detailUrl } from '@/lib/navigation';
import { ActiveFilters } from '@/components/active-filters';
import { pageUrl, results, type Params } from '@/lib/query';
import { SearchForm } from '@/components/search-form';
export async function generateMetadata({searchParams}:{searchParams:Promise<Params>}) {
  const {query} = results(await searchParams);
  const filters = [query.q,query.category,query.level].filter(Boolean).join(' · ');
  const filtered = Boolean(filters || query.sort !== 'default' || query.mode !== 'phrase' || query.size !== 6 || query.page !== 1);
  return { robots: { index: !filtered, follow: true }, title: filters ? `${filters} | Catalog Explorer` : 'Catalog Explorer', description: filters ? `Programming references matching ${filters}.` : 'Browse a small programming reference shelf.' };
}
export default async function Page({ searchParams }: { searchParams: Promise<Params> }) {
  const { query, entries, count, pages, facets, start, end, pageAdjusted } = results(await searchParams);
  return (
    <main id="main-content" className="mx-auto max-w-5xl p-6">
      <header className="mb-8">
        <p>A programming reference shelf</p>
        <h1 className="text-4xl font-semibold">Catalog Explorer</h1>
        <p>Browse short, authored notes on everyday programming concepts.</p>
      </header>
      <SearchForm query={query} facets={facets} />
      <ActiveFilters query={query} />
      <div id="results" tabIndex={-1} className="mb-4 flex justify-between gap-4 scroll-mt-4">
        <p>
          {count} {count === 1 ? 'note' : 'notes'} found · Showing {start}–{end}
        </p>
        <a href="/">Clear filters</a>
      </div>
      {pageAdjusted ? <p className="mb-4">That page is outside these results. Showing the last available page.</p> : null}
      {!count ? (
        <p className="rounded-lg border bg-white p-6">
          No notes match these filters. Try a broader search or clear the filters.
          {query.q ? <a className="mt-3 block" href={pageUrl({...query,q:''},1)}>Try without the search text</a> : null}
          {query.category ? <a className="mt-3 block" href={pageUrl({...query,category:''},1)}>Try all topics</a> : null}
          {query.level ? <a className="mt-3 block" href={pageUrl({...query,level:''},1)}>Try all levels</a> : null}
        </p>
      ) : null}
      <ul className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <li
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
            key={entry.id}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
              {entry.category} · {entry.level}
            </p>
            <h2 className="text-xl font-semibold">
              <a href={detailUrl(entry.id,pageUrl(query,query.page))}>{entry.title}</a>
            </h2>
            <p className="mt-3 leading-relaxed text-stone-600">
              {entry.summary}
            </p>
          </li>
        ))}
      </ul>
      <nav
        aria-label="Results pages"
        className="mt-6 flex flex-wrap items-center justify-center gap-4"
      >
        {query.page > 2 ? <a href={pageUrl(query,1)}>First page</a> : null}
        {query.page > 1 ? (
          <a aria-label="Previous result page" className="px-3 py-2" href={pageUrl(query, query.page - 1)}>Previous</a>
        ) : (
          <span />
        )}
        {Array.from({ length: pages }, (_, index) => index + 1).map((page) => (
          <a
            key={page}
            href={pageUrl(query, page)}
            aria-current={page === query.page ? 'page' : undefined}
            aria-label={`Page ${page}`}
            className="rounded border bg-white px-3 py-2 aria-[current=page]:font-bold"
          >
            {page}
          </a>
        ))}
        <span className="w-full text-center text-sm">
          Page {query.page} of {pages}
        </span>
        {query.page < pages ? (
          <a aria-label="Next result page" className="px-3 py-2" href={pageUrl(query, query.page + 1)}>Next</a>
        ) : (
          <span />
        )}
        {query.page < pages - 1 ? <a href={pageUrl(query,pages)}>Last page</a> : null}
      </nav>
    </main>
  );
}
