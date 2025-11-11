import './globals.css';
import Link from 'next/link';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/"><strong>Boardy App</strong></Link>
          <nav>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </header>
        <main>
          <Providers>
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}