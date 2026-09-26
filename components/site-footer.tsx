import { LogoMark } from '@/components/logo';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70">
      <div className="container flex max-w-6xl flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <LogoMark className="size-5" />
          <span>
            <span className="font-serif font-semibold text-foreground">
              Dogear
            </span>{' '}
            — fold the corner on what you want to learn next.
          </span>
        </p>
        <p className="font-mono text-xs">
          Saved in this browser only · No accounts, no tracking
        </p>
      </div>
    </footer>
  );
}
