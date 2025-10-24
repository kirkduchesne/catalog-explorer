'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="p-6">
      <h1>Could not load the catalog</h1>
      <p>
        Your requested page could not be displayed. Try again, or return to the
        unfiltered catalog.
      </p>
      <button className="mr-4 rounded border p-3" onClick={reset}>
        Try again
      </button>
      <a href="/">Clear filters</a>
    </main>
  );
}
