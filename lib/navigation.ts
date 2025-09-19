import { pageUrl, results, type Params } from './query';
export function detailUrl(id: number, back: string) {
  return `/notes/${id}?back=${encodeURIComponent(back)}`;
}
export function safeReturn(value: string | string[] | undefined): string {
  if (typeof value !== 'string' || !value.startsWith('/?') || value.length > 4000 || value.includes('#')) return '/';
  const search = new URLSearchParams(value.slice(2));
  const params: Params = {};
  for (const key of ['q','category','level','sort','mode','size','page']) {
    const values = search.getAll(key);
    params[key] = values.length === 1 ? values[0] : values;
  }
  const { query } = results(params);
  return pageUrl(query,query.page);
}
