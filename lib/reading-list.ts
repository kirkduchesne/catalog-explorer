export type ReadingEntry = { id: number; read: boolean; savedAt: string };
export const readingKey = 'catalog-reading-list-v1';
export const backupLimit = 65536;
export function parseReadingList(raw: string | null, allowed: readonly number[]): ReadingEntry[] {
  if (raw === null) return [];
  if (raw.length > backupLimit) throw new Error('Reading list exceeds 64 KiB of characters.');
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== 'object' || !('version' in data) || data.version !== 1 || !('entries' in data) || !Array.isArray(data.entries) || data.entries.length > allowed.length) throw new Error('Invalid reading-list format.');
  const seen = new Set<number>();
  return data.entries.map((entry: unknown) => {
    if (!entry || typeof entry !== 'object' || !('id' in entry) || typeof entry.id !== 'number' || !allowed.includes(entry.id) || seen.has(entry.id) || !('read' in entry) || typeof entry.read !== 'boolean' || !('savedAt' in entry) || typeof entry.savedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(entry.savedAt) || !Number.isFinite(Date.parse(entry.savedAt)) || new Date(entry.savedAt).toISOString() !== entry.savedAt) throw new Error('Reading-list entries are invalid.');
    seen.add(entry.id);
    return { id: entry.id, read: entry.read, savedAt: entry.savedAt };
  });
}
export function serializeReadingList(entries: ReadingEntry[], allowed: readonly number[]) {
  const clean = parseReadingList(JSON.stringify({ version: 1, entries }), allowed);
  return JSON.stringify({ version: 1, entries: clean }, null, 2);
}
