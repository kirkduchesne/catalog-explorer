import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { categories, levels } from '@/lib/catalog';
import { readQuery } from '@/lib/query';
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
      action="/"
      method="get"
      className="mb-6 grid gap-4 rounded-lg border bg-white p-5 sm:grid-cols-2 lg:grid-cols-5"
    >
      <div>
        <label htmlFor="q">Search notes</label>
        <Input id="q" name="q" defaultValue={query.q} aria-describedby="search-help" />
        <p id="search-help" className="mt-2 text-xs">Search uses the first 100 characters after normalization.</p>
      </div>
      <div>
        <label htmlFor="mode">Match</label>
        <select id="mode" name="mode" defaultValue={query.mode}><option value="phrase">Exact phrase</option><option value="words">All words</option></select>
      </div>
      <div>
        <label htmlFor="category">Topic</label>
        <select id="category" name="category" defaultValue={query.category}>
          <option value="">All topics</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value} ({facets.categories[value]})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="level">Level</label>
        <select id="level" name="level" defaultValue={query.level}>
          <option value="">All levels</option>
          {levels.map((value) => (
            <option key={value} value={value}>
              {value} ({facets.levels[value]})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="sort">Order</label>
        <select id="sort" name="sort" defaultValue={query.sort}>
          <option value="default">Reference order</option>
          <option value="title">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
          <option value="topic">Topic, then title</option>
        </select>
      </div>
      <Button className="self-end" type="submit">
        Apply filters
      </Button>
    </form>
  );
}
