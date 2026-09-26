import { type ReadingEntry } from './reading-list';
export function nextUnread(entries: ReadingEntry[], current?: number) {
  const position = entries.findIndex((entry) => entry.id === current);
  for (let offset = 1; offset <= entries.length; offset += 1) {
    const entry = entries[(position + offset) % entries.length];
    if (!entry.read && entry.id !== current) return entry.id;
  }
  return undefined;
}
