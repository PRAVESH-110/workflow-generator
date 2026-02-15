import type { Metadata } from 'next';
import { Inter, Montserrat, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Link from 'next/link';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

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
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${outfit.variable}`}>
      <body className="bg-black text-white font-sans antialiased">
        <Providers>
          <Toaster position="top-center" richColors theme="dark" />
          <nav className="bg-gradient-to-r from-black via-zinc-900 to-black backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <Link href="/" className="text-xl font-bold font-montserrat bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Workflow Builder
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="px-4 py-2 text-sm text-white hover:text-yellow-400 transition-all duration-200 rounded-3xl border border-transparent hover:border-yellow-500/40 hover:bg-yellow-500/5"
                  >
                    Builder
                  </Link>
                  <Link
                    href="/history"
                    className="px-4 py-2 text-sm text-white hover:text-yellow-400 transition-all duration-200 rounded-3xl border border-transparent hover:border-yellow-500/40 hover:bg-yellow-500/5"
                  >
                    History
                  </Link>
                  <Link
                    href="/status"
                    className="px-4 py-2 text-sm text-white hover:text-yellow-400 transition-all duration-200 rounded-3xl border border-transparent hover:border-yellow-500/40 hover:bg-yellow-500/5"
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
