import { Wordmark } from '@/components/logo';
import { ReadingNavLink } from '@/components/reading-summary';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65">
      <div className="container flex h-16 max-w-6xl items-center justify-between gap-4">
        <a
          href="/"
          aria-label="Dogear home"
          className="rounded-md no-underline"
        >
          <Wordmark />
        </a>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <a
            href="/"
            className="hidden h-9 items-center rounded-full px-3 text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground sm:inline-flex"
          >
            Browse
          </a>
          <ReadingNavLink />
        </nav>
      </div>
    </header>
  );
}
