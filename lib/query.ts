import { catalog, categories, levels } from './catalog';
export type Params = Record<string, string | string[] | undefined>;
function single(value: string | string[] | undefined) { return typeof value === 'string' ? value : ''; }
export function readQuery(params: Params) {
  const q = single(params.q).trim().slice(0, 100);
  const categoryValue = single(params.category);
  const levelValue = single(params.level);
  const category = categories.find(value => value === categoryValue) || '';
  const level = levels.find(value => value === levelValue) || '';
  const rawPage = single(params.page);
  const page = /^\d{1,6}$/.test(rawPage) && Number(rawPage) > 0 ? Number(rawPage) : 1;
  return { q, category, level, page };
}
export function results(params: Params) {
  const query = readQuery(params);
  const matches = catalog.filter(entry => (!query.category || entry.category === query.category) && (!query.level || entry.level === query.level) && (entry.title + ' ' + entry.summary).toLowerCase().includes(query.q.toLowerCase()));
  return { query, matches };
}
