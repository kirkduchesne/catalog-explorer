import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { catalog } from '@/lib/catalog';

export function generateStaticParams() {
  return catalog.map((entry) => ({ id: String(entry.id) }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const entry = catalog.find((item) => String(item.id) === params.id);
  return entry ? { title: `${entry.title} | Catalog Explorer`, description: entry.summary } : { title: 'Note not found | Catalog Explorer' };
}

export default function NotePage({ params }: { params: { id: string } }) {
  const entry = catalog.find((item) => String(item.id) === params.id);
  if (!entry) notFound();
  return (
    <main id="main-content" className="mx-auto max-w-3xl p-6">
      <a href="/">Back to catalog</a>
      <p className="mt-8 text-sm font-semibold text-primary">{entry.category} · {entry.level}</p>
      <h1 className="mt-3 text-3xl font-semibold">{entry.title}</h1>
      <p className="mt-6 text-lg leading-relaxed">{entry.summary}</p>
      <p className="mt-8 text-stone-600">Use this short reference as a starting point when reviewing your own code.</p>
    </main>
  );
}
