"use client";
import { useReadingList } from './reading-provider';
export function ReadingSummary() {const {entries,ready,error,announcement,reload}=useReadingList();return <div className="mb-5 text-sm"><a href="/reading-list">Reading list{ready?` (${entries.length})`:''}</a><p role="status">{announcement}</p>{error?<div><p role="alert">{error}</p><button type="button" onClick={reload}>Reload saved list</button></div>:null}</div>;}
