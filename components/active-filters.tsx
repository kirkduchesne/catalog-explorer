import { pageUrl, readQuery } from '@/lib/query';
export function ActiveFilters({query}:{query:ReturnType<typeof readQuery>}) {
  return <nav aria-label="Active filters" className="mb-4 flex flex-wrap gap-3 break-words">
    {query.q ? <a className="min-w-0 max-w-full rounded border bg-white px-3 py-2 [overflow-wrap:anywhere]" href={pageUrl({...query,q:''},1)}>Remove search: {query.q}</a> : null}
    {query.category ? <a className="min-w-0 max-w-full rounded border bg-white px-3 py-2 [overflow-wrap:anywhere]" href={pageUrl({...query,category:''},1)}>Remove topic: {query.category}</a> : null}
    {query.level ? <a className="min-w-0 max-w-full rounded border bg-white px-3 py-2 [overflow-wrap:anywhere]" href={pageUrl({...query,level:''},1)}>Remove level: {query.level}</a> : null}
  </nav>;
}
