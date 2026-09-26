import { catalog } from './catalog';
import { type ReadingEntry } from './reading-list';
export type ReadingFilter = 'all' | 'unread' | 'read';
export function filterReading(
  entries: ReadingEntry[],
  status: ReadingFilter,
  search = '',
) {
  const needle = Array.from(search)
    .slice(0, 100)
    .join('')
    .normalize('NFKC')
    .toLocaleLowerCase('en')
    .trim();
  return entries.filter((entry) => {
    const item = catalog.find((item) => item.id === entry.id);
    return (
      (status === 'all' || entry.read === (status === 'read')) &&
      (!needle ||
        `${item?.title} ${item?.category}`
          .normalize('NFKC')
          .toLocaleLowerCase('en')
          .includes(needle))
    );
  });
}
