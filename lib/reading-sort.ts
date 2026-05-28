import { catalog } from './catalog';
import { type ReadingEntry } from './reading-list';
export function sortReading(entries:ReadingEntry[],sort:'saved'|'title') {return [...entries].sort((a,b)=>sort==='title'?(catalog.find((item)=>item.id===a.id)!.title.localeCompare(catalog.find((item)=>item.id===b.id)!.title,'en')||a.id-b.id):(b.savedAt.localeCompare(a.savedAt)||a.id-b.id));}
