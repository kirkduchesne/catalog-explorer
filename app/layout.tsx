import './globals.css';
export const metadata = { title: 'Catalog Explorer', description: 'Browse a small programming reference shelf.' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
