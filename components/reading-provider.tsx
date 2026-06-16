"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { readingKey, type ReadingEntry } from '@/lib/reading-list';
import { loadReadingList, persistReadingList } from '@/lib/reading-storage';
type ReadingContext = { entries: ReadingEntry[]; ready: boolean; error: string; announcement: string; write: (entries: ReadingEntry[], message: string) => boolean; reload: () => void; allowed: readonly number[] };
const Context = createContext<ReadingContext | null>(null);
export function ReadingProvider({ids,children}:{ids:number[];children:ReactNode}) {
  const allowed = useRef(ids).current;
  const snapshot = useRef<string|null>(null);
  const [entries,setEntries] = useState<ReadingEntry[]>([]);
  const [ready,setReady] = useState(false);
  const [error,setError] = useState('');
  const [announcement,setAnnouncement] = useState('');
  const announceTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  function announce(message:string){setAnnouncement('');if(announceTimer.current)clearTimeout(announceTimer.current);announceTimer.current=setTimeout(()=>setAnnouncement(message),30);}
  useEffect(()=>()=>{if(announceTimer.current)clearTimeout(announceTimer.current);},[]);
  function reload() {
    try { const loaded=loadReadingList(localStorage,allowed);snapshot.current=loaded.raw;setEntries(loaded.entries);setReady(true);setError('');setAnnouncement('Saved reading list loaded.'); }
    catch { setReady(false);setError('Saved reading list cannot be read. Existing data is preserved; check browser storage and reload.'); }
  }
  useEffect(reload, [allowed]);
  useEffect(()=>{function changed(event:StorageEvent){if(event.storageArea===localStorage&&(event.key===readingKey||event.key===null)){setReady(false);setError('Reading list changed in another tab. Reload the saved list before changing it.');}}window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed);},[]);
  function write(next:ReadingEntry[],message:string) {
    if(!ready)return false;
    try {snapshot.current=persistReadingList(localStorage,next,snapshot.current,allowed);setEntries(next);setError('');announce(message);return true;}
    catch(error) {setError(error instanceof Error ? error.message : 'Reading list could not be saved.');return false;}
  }
  return <Context.Provider value={{entries,ready,error,announcement,write,reload,allowed}}>{children}</Context.Provider>;
}
export function useReadingList() {const value=useContext(Context);if(!value)throw new Error('Reading provider is missing.');return value;}
