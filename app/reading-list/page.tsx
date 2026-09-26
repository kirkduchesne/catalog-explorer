import { ShieldCheck } from '@/components/icons';
import { ReadingBackup } from '@/components/reading-backup';
import { ReadingList } from '@/components/reading-list';
export const metadata = {
  title: 'Reading list | Dogear',
  robots: { index: false, follow: true },
};
export default function ReadingListPage() {
  return (
    <main id="main-content" className="container max-w-4xl pt-10 sm:pt-14">
      <header className="mb-8 animate-fade-up">
        <p className="mb-3 font-mono text-xs text-muted-foreground">
          Your folded corners
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Reading list
        </h1>
        <p className="mt-4 flex max-w-xl items-start gap-2 text-sm text-muted-foreground">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
          />
          Saved references are kept in this browser only. They are not synced or
          sent to a server.
        </p>
      </header>
      <noscript>
        <p className="mb-6 rounded-lg border border-dashed bg-card p-4 text-sm">
          JavaScript is required for the browser-local reading list. Catalog
          browsing still works without it.
        </p>
      </noscript>
      <ReadingList />
      <ReadingBackup />
    </main>
  );
}
