import { pageUrl, readQuery } from '@/lib/query';
export function ActiveFilters({query}:{query:ReturnType<typeof readQuery>}) {
  return <nav aria-label="Active filters" className="mb-4 flex gap-3">
    {query.q ? <a href={pageUrl({...query,q:''},1)}>Remove search: {query.q}</a> : null}
    {query.category ? <a href={pageUrl({...query,category:''},1)}>Remove topic: {query.category}</a> : null}
  </nav>;
}
