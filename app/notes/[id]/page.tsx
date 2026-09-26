import { ArrowLeft, ArrowRight, BookOpen } from '@/components/icons';
import { ReadingDetail } from '@/components/reading-detail';
import { BookmarkButton } from '@/components/bookmark-button';
import { LevelBadge, TopicBadge } from '@/components/topic-badge';
import { Card } from '@/components/ui/card';
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
    ? { title: `${entry.title} | Dogear`, description: entry.summary }
    : { title: 'Note not found | Dogear' };
}

const neighbor =
  'group flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4 text-foreground no-underline shadow-paper transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-lift';

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
    <main id="main-content" className="container max-w-3xl pt-8 sm:pt-12">
      <a
        href={back}
        className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to results
      </a>
      <article className="dogear mt-6 animate-fade-up rounded-2xl border bg-card p-6 shadow-paper sm:p-10">
        <div className="flex flex-wrap items-center gap-3 pr-8">
          <TopicBadge topic={entry.category} />
          <LevelBadge level={entry.level} />
          <span className="font-mono text-[11px] text-muted-foreground">
            Note {String(position + 1).padStart(2, '0')} of{' '}
            {String(topic.length).padStart(2, '0')}
          </span>
        </div>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
          {entry.title}
        </h1>
        <p className="mt-6 border-l-2 border-brand pl-5 font-serif text-xl leading-relaxed sm:text-2xl">
          {entry.summary}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6">
          <BookmarkButton id={entry.id} title={entry.title} />
          <ReadingDetail id={entry.id} />
        </div>
      </article>
      <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
        <BookOpen aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        Use this short reference as a starting point when reviewing your own
        code.
      </p>
      <section className="mt-12" aria-labelledby="related-heading">
        <h2
          id="related-heading"
          className="font-serif text-2xl font-semibold tracking-tight"
        >
          More in {entry.category}
        </h2>
        <ul className="mt-4 divide-y rounded-xl border bg-card shadow-paper">
          {topic
            .filter((item) => item.id !== entry.id)
            .slice(0, 3)
            .map((item) => (
              <li key={item.id}>
                <a
                  href={detailUrl(item.id, back)}
                  className="group flex items-center justify-between gap-4 px-5 py-4 text-foreground no-underline transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-accent/60"
                >
                  <span className="min-w-0">
                    <span className="block font-medium group-hover:text-brand-ink">
                      {item.title}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
        </ul>
      </section>
      <nav
        aria-label="Same topic reading order"
        className="mt-10 grid gap-4 sm:grid-cols-2"
      >
        {previous ? (
          <a href={detailUrl(previous.id, back)} rel="prev" className={neighbor}>
            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              Previous:
            </span>{' '}
            <span className="font-serif text-lg font-semibold group-hover:text-brand-ink">
              {previous.title}
            </span>
          </a>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <a
            href={detailUrl(next.id, back)}
            rel="next"
            className={`${neighbor} sm:items-end sm:text-right`}
          >
            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
              Next:
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </span>{' '}
            <span className="font-serif text-lg font-semibold group-hover:text-brand-ink">
              {next.title}
            </span>
          </a>
        ) : null}
      </nav>
    </main>
  );
}
