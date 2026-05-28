"use client";
import { sortReading } from '@/lib/reading-sort';
import { useState } from 'react';
import { filterReading, type ReadingFilter } from '@/lib/reading-query';
import { useReadingList } from './reading-provider';
import { catalog } from '@/lib/catalog';
import { detailUrl } from '@/lib/navigation';
import { removeReference, setRead } from '@/lib/reading-actions';
export function ReadingList() {
  const {entries,ready,write}=useReadingList();
  const [status,setStatus]=useState<ReadingFilter>('all');
  const [search,setSearch]=useState('');
  const [sort,setSort]=useState<'saved'|'title'>('saved');
  const visible=sortReading(filterReading(entries,status,search),sort);
  if(!ready)return <p>Reading list is unavailable or loading.</p>;
  return <section aria-label="Saved references"><label className="mb-3 block">Search saved titles or topics<input type="search" className="ml-2 border p-2" value={search} onChange={(event)=>setSearch(Array.from(event.target.value).slice(0,100).join(''))}/></label><label className="block">Reading status<select className="ml-2 border p-2" value={status} onChange={(event)=>setStatus(event.target.value as ReadingFilter)}><option value="all">All saved</option><option value="unread">Unread</option><option value="read">Read</option></select></label><label className="my-3 block">Sort saved references<select className="ml-2 border p-2" value={sort} onChange={(event)=>setSort(event.target.value as 'saved'|'title')}><option value="saved">Recently saved</option><option value="title">Title A–Z</option></select></label><p>{visible.length} saved references</p>{visible.length===0?<p>{entries.length ? 'No saved references match these filters.' : 'Your reading list is empty. Browse the catalog and save a reference.'}</p>:<ul className="mt-4 space-y-4">{visible.map((saved)=>{const item=catalog.find((entry)=>entry.id===saved.id)!;return <li key={saved.id} className="rounded border p-4"><a className="text-lg font-semibold" href={detailUrl(item.id,'/reading-list')}>{item.title}</a><p>{item.category} · {item.level}</p><p>{item.summary}</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" aria-pressed={saved.read} onClick={()=>write(setRead(entries,item.id,!saved.read),saved.read?`Marked ${item.title} unread.`:`Marked ${item.title} read.`)}>{saved.read?'Mark unread':'Mark read'}</button><button type="button" onClick={()=>write(removeReference(entries,item.id),`Removed ${item.title}.`)}>Remove <span className="sr-only">{item.title}</span></button></div></li>;})}</ul>}</section>;
}
