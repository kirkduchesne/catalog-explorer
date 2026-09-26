import {
  parseReadingList,
  serializeReadingList,
  type ReadingEntry,
} from './reading-list';
export function previewBackup(
  raw: string,
  current: ReadingEntry[],
  allowed: readonly number[],
) {
  const entries = parseReadingList(raw, allowed);
  return {
    entries,
    added: entries.filter(
      (entry) => !current.some((saved) => saved.id === entry.id),
    ).length,
    existing: entries.filter((entry) =>
      current.some((saved) => saved.id === entry.id),
    ).length,
  };
}
export function mergeBackup(
  current: ReadingEntry[],
  incoming: ReadingEntry[],
  allowed: readonly number[],
) {
  const merged = [
    ...current,
    ...incoming.filter(
      (entry) => !current.some((saved) => saved.id === entry.id),
    ),
  ];
  return parseReadingList(serializeReadingList(merged, allowed), allowed);
}
