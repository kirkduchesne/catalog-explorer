import { type ReadingEntry } from './reading-list';
export function saveReference(
  entries: ReadingEntry[],
  id: number,
  savedAt: string,
): ReadingEntry[] {
  return entries.some((entry) => entry.id === id)
    ? entries
    : [...entries, { id, savedAt, read: false }];
}
export function removeReference(entries: ReadingEntry[], id: number) {
  return entries.filter((entry) => entry.id !== id);
}
export function setRead(entries: ReadingEntry[], id: number, read: boolean) {
  return entries.map((entry) => (entry.id === id ? { ...entry, read } : entry));
}
