"use client";
import { useReadingList } from './reading-provider';
import { setRead } from '@/lib/reading-actions';
export function ReadingDetail({id}:{id:number}) {const {entries,ready,write}=useReadingList();const saved=entries.find((entry)=>entry.id===id);if(!ready||!saved)return null;return <aside className="my-4" aria-label="Saved reading progress"><button type="button" aria-pressed={saved.read} onClick={()=>write(setRead(entries,id,!saved.read),saved.read?'Marked unread.':'Marked read.')}>{saved.read?'Mark unread':'Mark read'}</button></aside>;}
