"use client";
import { useReadingList } from './reading-provider';
import { saveReference, removeReference } from '@/lib/reading-actions';
export function BookmarkButton({id,title}:{id:number;title:string}) {
  const {entries,ready,write,error}=useReadingList();
  const saved=entries.some((entry)=>entry.id===id);
  return <div className="mt-3"><button type="button" disabled={!ready} aria-pressed={saved} className="rounded border px-3 py-2 disabled:opacity-50" onClick={()=>write(saved?removeReference(entries,id):saveReference(entries,id,new Date().toISOString()),saved?`Removed ${title}.`:`Saved ${title}.`)}>{saved?'Remove from reading list':'Save to reading list'}</button>{error?<p role="alert" className="mt-2 text-sm">{error}</p>:null}</div>;
}
