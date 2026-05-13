import { ReadingSummary } from '@/components/reading-summary';
export const metadata = {title:'Reading list | Catalog Explorer',robots:{index:false,follow:true}};
export default function ReadingListPage(){return <main id="main-content" className="mx-auto max-w-4xl p-6"><a href="/">Browse references</a><h1 className="my-4 text-3xl font-semibold">Reading list</h1><ReadingSummary/><p>Saved references are kept in this browser.</p></main>;}
