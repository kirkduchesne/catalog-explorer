import { catalog, categories, levels } from './catalog';
export type Params = Record<string, string | string[] | undefined>;
function single(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}
function normalize(value: string) {
  return value.normalize('NFKC').replace(/\s+/gu, ' ').trim();
}
export function readQuery(params: Params) {
  const q = Array.from(normalize(single(params.q)))
    .slice(0, 100)
    .join('');
  const categoryValue = single(params.category);
  const levelValue = single(params.level);
  const category = categories.find((value) => value === categoryValue) || '';
  const level = levels.find((value) => value === levelValue) || '';
  const rawPage = single(params.page);
  const page =
    /^\d{1,6}$/.test(rawPage) && Number(rawPage) > 0 ? Number(rawPage) : 1;
  const sortValue = single(params.sort);
  const sort =
    sortValue === 'title' || sortValue === 'topic' || sortValue === 'title-desc'
      ? sortValue
      : 'default';
  const mode = single(params.mode) === 'words' ? 'words' : 'phrase';
  const size = single(params.size) === '12' ? 12 : 6;
  return { q, category, level, page, sort, mode, size };
}
const searchText = new Map(
  catalog.map((entry) => [
    entry.id,
    normalize(entry.title + ' ' + entry.summary).toLowerCase(),
  ])
);
function matchesText(entry: (typeof catalog)[number], q: string, mode: string) {
  const text = searchText.get(entry.id)!;
  return mode === 'words'
    ? q
        .toLowerCase()
        .split(' ')
        .every((word) => text.includes(word))
    : text.includes(q.toLowerCase());
}
export function results(params: Params) {
  const query = readQuery(params);
  const textMatches = catalog.filter((entry) =>
    matchesText(entry, query.q, query.mode)
  );
  const matches = textMatches.filter(
    (entry) =>
      (!query.category || entry.category === query.category) &&
      (!query.level || entry.level === query.level)
  );
  if (query.sort === 'title')
    matches.sort((a, b) => a.title.localeCompare(b.title, 'en') || a.id - b.id);
  if (query.sort === 'title-desc')
    matches.sort((a, b) => b.title.localeCompare(a.title, 'en') || a.id - b.id);
  if (query.sort === 'topic')
    matches.sort(
      (a, b) =>
        a.category.localeCompare(b.category, 'en') ||
        a.title.localeCompare(b.title, 'en') ||
        a.id - b.id
    );
  const facets = {
    categories: Object.fromEntries(categories.map((category) => [category, 0])),
    levels: Object.fromEntries(levels.map((level) => [level, 0])),
  };
  for (const entry of textMatches) {
    if (!query.level || entry.level === query.level)
      facets.categories[entry.category] += 1;
    if (!query.category || entry.category === query.category)
      facets.levels[entry.level] += 1;
  }
  const pages = Math.max(1, Math.ceil(matches.length / query.size));
  const page = Math.min(query.page, pages);
  return {
    query: { ...query, page },
    entries: matches.slice((page - 1) * query.size, page * query.size),
    count: matches.length,
    start: matches.length ? (page - 1) * query.size + 1 : 0,
    end: Math.min(page * query.size, matches.length),
    pageAdjusted: page !== query.page,
    pages,
    facets,
  };
}

export function pageUrl(query: ReturnType<typeof readQuery>, page: number) {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.category) params.set('category', query.category);
  if (query.level) params.set('level', query.level);
  if (query.sort !== 'default') params.set('sort', query.sort);
  if (query.mode === 'words') params.set('mode', query.mode);
  if (query.size === 12) params.set('size', '12');
  params.set('page', String(page));
  return '/?' + params.toString();
}
