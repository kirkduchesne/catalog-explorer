import { LogoMark } from '@/components/logo';
import { Button } from '@/components/ui/button';
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="container flex max-w-xl flex-col items-center py-24 text-center"
    >
      <LogoMark className="size-16 -rotate-6 opacity-90" />
      <p className="mt-6 font-mono text-xs text-muted-foreground">Error 404</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-4 text-muted-foreground">
        This page slipped off the shelf. The notes are right where you left
        them.
      </p>
      <Button asChild className="mt-8">
        <a href="/">Return to the catalog</a>
      </Button>
    </main>
  );
}
