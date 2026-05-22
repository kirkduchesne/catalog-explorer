import { type ReadingEntry } from './reading-list';
export type ReadingFilter = 'all' | 'unread' | 'read';
export function filterReading(entries:ReadingEntry[],status:ReadingFilter){return entries.filter((entry)=>status==='all'||entry.read===(status==='read'));}
