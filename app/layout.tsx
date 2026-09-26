import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ReadingProvider } from '@/components/reading-provider';
import { ReadingSummary } from '@/components/reading-summary';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { catalog } from '@/lib/catalog';
export const metadata: Metadata = {
  title: 'Dogear',
  description:
    'Short, authored notes on everyday programming. Fold the corner on the ones you want to read next.',
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f5ef' },
    { media: '(prefers-color-scheme: dark)', color: '#0f121a' },
  ],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only rounded-md bg-primary text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:block focus:px-4 focus:py-3"
        >
          Skip to content
        </a>
        <ReadingProvider ids={catalog.map((entry) => entry.id)}>
          <SiteHeader />
          <ReadingSummary />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </ReadingProvider>
      </body>
    </html>
  );
}
