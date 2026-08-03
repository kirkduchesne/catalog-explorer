import { type ReadingEntry } from './reading-list';
export function nextUnread(entries: ReadingEntry[], current?: number) {
  return entries.find((entry) => !entry.read && entry.id !== current)?.id;
}
