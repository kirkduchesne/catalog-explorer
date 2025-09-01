import { pageUrl, results, type Params } from '@/lib/query';
import { SearchForm } from '@/components/search-form';
export default async function Page({ searchParams }: { searchParams: Promise<Params> }) {
  const { query, entries, count, pages, facets } = results(await searchParams);
  return (
    <main id="main-content" className="mx-auto max-w-5xl p-6">
      <header className="mb-8">
        <p>A programming reference shelf</p>
        <h1 className="text-4xl font-semibold">Catalog Explorer</h1>
        <p>Browse short, authored notes on everyday programming concepts.</p>
      </header>
      <SearchForm query={query} facets={facets} />
      <div className="mb-4 flex justify-between gap-4">
        <p>
          {count} {count === 1 ? 'note' : 'notes'} found
        </p>
        <a href="/">Clear filters</a>
      </div>
      {!count ? (
        <p className="rounded-lg border bg-white p-6">
          No notes match these filters. Try a broader search or clear the
          filters.
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
              <a href={`/notes/${entry.id}`}>{entry.title}</a>
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
        {query.page > 1 ? (
          <a href={pageUrl(query, query.page - 1)}>Previous</a>
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
          <a href={pageUrl(query, query.page + 1)}>Next</a>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
