import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Signal Gen - AI Trading Assistant',
  description: 'AI-powered cryptocurrency trading signals and analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" data-theme="dark-cyan" className="h-full">
      <body className={`${inter.className} h-full bg-black text-gray-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}