import { ReadingList } from '@/components/reading-list';
import { ReadingSummary } from '@/components/reading-summary';
export const metadata = {title:'Reading list | Catalog Explorer',robots:{index:false,follow:true}};
export default function ReadingListPage(){return <main id="main-content" className="mx-auto max-w-4xl p-6"><a href="/">Browse references</a><h1 className="my-4 text-3xl font-semibold">Reading list</h1><ReadingSummary/><p className="mb-4">Saved references are kept in this browser only. They are not synced or sent to a server.</p><noscript><p>JavaScript is required for the browser-local reading list. Catalog browsing still works without it.</p></noscript><ReadingList/></main>;}
