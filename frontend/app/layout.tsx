import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Workflow Builder Lite',
  description: 'Automation runner for text processing workflows',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-8">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    Workflow Builder Lite
                  </Link>
                  <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Builder
                  </Link>
                  <Link
                    href="/history"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    History
                  </Link>
                  <Link
                    href="/status"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Status
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
