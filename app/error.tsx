'use client';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main
      id="main-content"
      className="container flex max-w-xl flex-col items-center py-24 text-center"
    >
      <p className="font-mono text-xs text-muted-foreground">Something tore</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">
        Could not load the catalog
      </h1>
      <p className="mt-4 text-muted-foreground">
        Your requested page could not be displayed. Try again, or return to the
        unfiltered catalog.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={reset}>
          <RotateCw aria-hidden="true" />
          Try again
        </Button>
        <Button asChild variant="outline">
          <a href="/">Clear filters</a>
        </Button>
      </div>
    </main>
  );
}
