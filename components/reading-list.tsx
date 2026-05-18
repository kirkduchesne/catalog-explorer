"use client";
import { useReadingList } from './reading-provider';
import { catalog } from '@/lib/catalog';
import { detailUrl } from '@/lib/navigation';
import { removeReference, setRead } from '@/lib/reading-actions';
export function ReadingList() {
  const {entries,ready,write}=useReadingList();
  const visible=entries;
  if(!ready)return <p>Reading list is unavailable or loading.</p>;
  return <section aria-label="Saved references"><p>{visible.length} saved references</p>{visible.length===0?<p>Your reading list is empty. Browse the catalog and save a reference.</p>:<ul className="mt-4 space-y-4">{visible.map((saved)=>{const item=catalog.find((entry)=>entry.id===saved.id)!;return <li key={saved.id} className="rounded border p-4"><a className="text-lg font-semibold" href={detailUrl(item.id,'/reading-list')}>{item.title}</a><p>{item.category} · {item.level}</p><p>{item.summary}</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={()=>write(removeReference(entries,item.id),`Removed ${item.title}.`)}>Remove <span className="sr-only">{item.title}</span></button></div></li>;})}</ul>}</section>;
}
