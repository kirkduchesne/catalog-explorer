import { serializeReadingList, type ReadingEntry } from './reading-list';
export function downloadReading(
  entries: ReadingEntry[],
  allowed: readonly number[],
) {
  const raw = serializeReadingList(entries, allowed);
  const url = URL.createObjectURL(
    new Blob([raw], { type: 'application/json' }),
  );
  const link = document.createElement('a');
  try {
    link.href = url;
    link.download = 'dogear-reading-list.json';
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
