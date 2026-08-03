import {
  parseReadingList,
  readingKey,
  serializeReadingList,
  type ReadingEntry,
} from './reading-list';
export type ReadingStorage = Pick<Storage, 'getItem' | 'setItem'>;
export function loadReadingList(
  storage: ReadingStorage,
  allowed: readonly number[],
) {
  const raw = storage.getItem(readingKey);
  return { entries: parseReadingList(raw, allowed), raw };
}
export function persistReadingList(
  storage: ReadingStorage,
  entries: ReadingEntry[],
  expected: string | null,
  allowed: readonly number[],
) {
  const raw = serializeReadingList(entries, allowed);
  if (storage.getItem(readingKey) !== expected)
    throw new Error(
      'Reading list changed in another tab. Reload the saved list before changing it.',
    );
  storage.setItem(readingKey, raw);
  return raw;
}
