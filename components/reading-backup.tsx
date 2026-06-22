"use client";
import { useState } from 'react';
import { useReadingList } from './reading-provider';
import { downloadReading } from '@/lib/reading-download';
export function ReadingBackup(){const {entries,allowed,ready}=useReadingList();const [message,setMessage]=useState('');return <section className="my-6 border-t pt-4" aria-labelledby="backup-heading"><h2 id="backup-heading" className="text-xl font-semibold">Reading-list backup</h2><button type="button" disabled={!ready} onClick={()=>{try{downloadReading(entries,allowed);setMessage('Backup download requested.');}catch{setMessage('Backup could not be downloaded. Your saved list is unchanged.');}}}>Download all saved references</button><p role="status">{message}</p></section>;}
