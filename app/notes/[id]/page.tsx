import { ReadingSummary } from '@/components/reading-summary';
import { ReadingDetail } from '@/components/reading-detail';
import { BookmarkButton } from '@/components/bookmark-button';
import { safeReturn, detailUrl } from '@/lib/navigation';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { catalog } from '@/lib/catalog';

export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.map((entry) => ({ id: String(entry.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = catalog.find((item) => String(item.id) === id);
  return entry
    ? { title: `${entry.title} | Catalog Explorer`, description: entry.summary }
    : { title: 'Note not found | Catalog Explorer' };
}

export default async function NotePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back?: string | string[] }>;
}) {
  const back = safeReturn((await searchParams).back);
  const { id } = await params;
  const entry = catalog.find((item) => String(item.id) === id);
  if (!entry) notFound();
  const topic = catalog.filter((item) => item.category === entry.category);
  const position = topic.findIndex((item) => item.id === entry.id);
  const previous = topic[position - 1];
  const next = topic[position + 1];
  return (
    <main id="main-content" className="mx-auto max-w-3xl p-6">
      <a href={back}>Back to results</a>
      <p className="mt-8 text-sm font-semibold text-primary">
        {entry.category} · {entry.level}
      </p>
      <h1 className="mt-3 text-3xl font-semibold">{entry.title}</h1>
      <p className="mt-6 text-lg leading-relaxed">{entry.summary}</p>
      <ReadingSummary />
      <BookmarkButton id={entry.id} title={entry.title} />
      <ReadingDetail id={entry.id} />
      <p className="mt-8 text-stone-600">
        Use this short reference as a starting point when reviewing your own
        code.
      </p>
      <section className="mt-8" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-xl font-semibold">
          More in {entry.category}
        </h2>
        <ul className="mt-3 space-y-2">
          {topic
            .filter((item) => item.id !== entry.id)
            .slice(0, 3)
            .map((item) => (
              <li key={item.id}>
                <a href={detailUrl(item.id, back)}>{item.title}</a>
              </li>
            ))}
        </ul>
      </section>
      <nav
        aria-label="Same topic reading order"
        className="mt-8 grid gap-4 border-t pt-4 sm:grid-cols-2"
      >
        {previous ? (
          <a href={detailUrl(previous.id, back)} rel="prev">
            Previous: {previous.title}
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a href={detailUrl(next.id, back)} rel="next">
            Next: {next.title}
          </a>
        ) : null}
      </nav>
    </main>
  );
}
