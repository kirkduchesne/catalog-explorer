export function validateCatalog(entries: { id: number; title: string; category: string; level: string; summary: string }[], categories: readonly string[], levels: readonly string[]) {
  const ids = new Set<number>();
  for (const entry of entries) {
    if (!Number.isSafeInteger(entry.id) || entry.id < 1 || ids.has(entry.id)) throw new Error('Catalog IDs must be unique positive integers.');
    if (!entry.title.trim() || !entry.summary.trim() || !categories.includes(entry.category) || !levels.includes(entry.level)) throw new Error('Catalog metadata is invalid.');
    ids.add(entry.id);
  }
}
