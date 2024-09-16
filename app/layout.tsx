import './globals.css';
export const metadata = {
  title: 'Catalog Explorer',
  description: 'Browse a small programming reference shelf.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><a href="#main-content" className="sr-only focus:not-sr-only focus:block focus:p-4">Skip to content</a>{children}</body>
    </html>
  );
}
