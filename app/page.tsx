import { results, type Params } from '@/lib/query';
import { SearchForm } from '@/components/search-form';
export default function Page({ searchParams }: { searchParams: Params }) {
  const { query, matches } = results(searchParams);
  return <main className="mx-auto max-w-5xl p-6"><header className="mb-8"><p>A programming reference shelf</p><h1 className="text-4xl font-semibold">Catalog Explorer</h1><p>Browse short, authored notes on everyday programming concepts.</p></header><SearchForm query={query} /><ul className="grid gap-4 sm:grid-cols-2">{matches.map(entry => <li className="rounded-lg border p-5" key={entry.id}><p>{entry.category} · {entry.level}</p><h2 className="text-xl font-semibold">{entry.title}</h2><p>{entry.summary}</p></li>)}</ul></main>;
}
