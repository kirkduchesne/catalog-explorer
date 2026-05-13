"use client";
import { useReadingList } from './reading-provider';
export function ReadingSummary() {const {entries,ready,error,announcement}=useReadingList();return <div className="mb-5 text-sm"><a href="/reading-list">Reading list{ready?` (${entries.length})`:''}</a><p role="status">{announcement}</p>{error?<p role="alert">{error}</p>:null}</div>;}
