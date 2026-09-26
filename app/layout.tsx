import './globals.css';
import { ReadingProvider } from '@/components/reading-provider';
import { catalog } from '@/lib/catalog';
export const metadata = {
  title: 'Catalog Explorer',
  description: 'Browse a small programming reference shelf.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:block focus:p-4"
        >
          Skip to content
        </a>
        <ReadingProvider ids={catalog.map((entry) => entry.id)}>
          {children}
        </ReadingProvider>
      </body>
    </html>
  );
}
