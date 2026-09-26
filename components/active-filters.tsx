import { X } from '@/components/icons';
import { pageUrl, readQuery } from '@/lib/query';
const chip =
  'group inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border bg-card py-1.5 pl-3 pr-2 text-sm text-foreground no-underline shadow-sm transition-colors hover:border-destructive/50 hover:text-destructive [overflow-wrap:anywhere]';
function Chip({ href, kind, value }: { href: string; kind: string; value: string }) {
  return (
    <a className={chip} href={href}>
      <span className="min-w-0">
        <span className="sr-only">Remove </span>
        <span className="font-mono text-xs text-muted-foreground">{kind}:</span>{' '}
        <span className="font-medium">{value}</span>
      </span>
      <X
        aria-hidden="true"
        className="size-3.5 shrink-0 rounded-full text-muted-foreground group-hover:text-destructive"
      />
    </a>
  );
}
export function ActiveFilters({
  query,
}: {
  query: ReturnType<typeof readQuery>;
}) {
  if (!query.q && !query.category && !query.level) return null;
  return (
    <nav
      aria-label="Active filters"
      className="mt-4 flex flex-wrap items-center gap-2 break-words"
    >
      {query.q ? (
        <Chip href={pageUrl({ ...query, q: '' }, 1)} kind="search" value={query.q} />
      ) : null}
      {query.category ? (
        <Chip
          href={pageUrl({ ...query, category: '' }, 1)}
          kind="topic"
          value={query.category}
        />
      ) : null}
      {query.level ? (
        <Chip
          href={pageUrl({ ...query, level: '' }, 1)}
          kind="level"
          value={query.level}
        />
      ) : null}
    </nav>
  );
}
