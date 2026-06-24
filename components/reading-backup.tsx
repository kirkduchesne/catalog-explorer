"use client";
import { useState } from 'react';
import { useReadingList } from './reading-provider';
import { backupLimit } from '@/lib/reading-list';
import { downloadReading } from '@/lib/reading-download';
export function ReadingBackup(){const {entries,allowed,ready}=useReadingList();const [message,setMessage]=useState('');const [raw,setRaw]=useState('');return <section className="my-6 border-t pt-4" aria-labelledby="backup-heading"><h2 id="backup-heading" className="text-xl font-semibold">Reading-list backup</h2><button type="button" disabled={!ready} onClick={()=>{try{downloadReading(entries,allowed);setMessage('Backup download requested.');}catch{setMessage('Backup could not be downloaded. Your saved list is unchanged.');}}}>Download all saved references</button><label className="mt-4 block">Paste reading-list backup<textarea className="mt-2 block min-h-32 w-full border p-2" value={raw} maxLength={backupLimit} onChange={(event)=>setRaw(event.target.value)}/></label><p>JSON only, up to 65,536 characters. Existing entries will keep their reading status.</p><p role="status">{message}</p></section>;}
