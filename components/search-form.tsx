import { Search, SlidersHorizontal } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/ui/native-select';
import { categories, levels } from '@/lib/catalog';
import { readQuery, pageUrl } from '@/lib/query';
export function SearchForm({
  query,
  facets,
}: {
  query: ReturnType<typeof readQuery>;
  facets: {
    categories: Record<string, number>;
    levels: Record<string, number>;
  };
}) {
  return (
    <form
      action="/#results"
      method="get"
      className="rounded-2xl border bg-card p-4 shadow-paper sm:p-6"
    >
      <fieldset className="grid min-w-0 gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-6">
        <legend className="sr-only">
          Search and browse the reference catalog
        </legend>
        <div className="min-w-0 sm:col-span-2 lg:col-span-4">
          <label htmlFor="q">Search notes</label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="q"
              name="q"
              type="search"
              defaultValue={query.q}
              placeholder="Try “labels”, “async”, or “files close”"
              className="h-11 pl-10 text-base sm:text-sm"
              aria-describedby="search-help"
            />
          </div>
          <p id="search-help" className="mt-2 text-xs text-muted-foreground">
            Search uses the first 100 characters after normalization.
          </p>
        </div>
        <div className="min-w-0 lg:col-span-2">
          <label htmlFor="mode">Match</label>
          <NativeSelect
            id="mode"
            name="mode"
            defaultValue={query.mode}
            className="h-11"
          >
            <option value="phrase">Exact phrase</option>
            <option value="words">All words</option>
          </NativeSelect>
        </div>
        <div className="min-w-0 lg:col-span-2">
          <label htmlFor="category">Topic</label>
          <NativeSelect
            id="category"
            aria-describedby="facet-help"
            name="category"
            defaultValue={query.category}
          >
            <option value="">All topics</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value} ({facets.categories[value]})
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="min-w-0 lg:col-span-2">
          <label htmlFor="level">Level</label>
          <NativeSelect
            id="level"
            aria-describedby="facet-help"
            name="level"
            defaultValue={query.level}
          >
            <option value="">All levels</option>
            {levels.map((value) => (
              <option key={value} value={value}>
                {value} ({facets.levels[value]})
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="min-w-0">
          <label htmlFor="sort">Order</label>
          <NativeSelect id="sort" name="sort" defaultValue={query.sort}>
            <option value="default">Reference order</option>
            <option value="title">Title A–Z</option>
            <option value="title-desc">Title Z–A</option>
            <option value="topic">Topic, then title</option>
          </NativeSelect>
        </div>
        <div className="min-w-0">
          <label htmlFor="size">Notes per page</label>
          <NativeSelect id="size" name="size" defaultValue={query.size}>
            <option value="6">6 notes</option>
            <option value="12">12 notes</option>
          </NativeSelect>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between lg:col-span-6">
          <p
            id="facet-help"
            className="flex items-start gap-2 text-xs text-muted-foreground"
          >
            <SlidersHorizontal
              aria-hidden="true"
              className="mt-px size-3.5 shrink-0"
            />
            Topic counts respect search and level; level counts respect search
            and topic.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {query.q ? (
              <Button asChild variant="ghost">
                <a href={pageUrl({ ...query, q: '' }, 1)}>Clear search only</a>
              </Button>
            ) : null}
            <Button type="submit" variant="brand" className="px-6">
              Apply filters
            </Button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}
