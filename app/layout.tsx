import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Nexus Beings',
  description: 'Revolutionizing the world of digital humans',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body
          className={cn(
            'hide-scrollbar overflow-y-auto overflow-x-hidden w-full bg-background text-foreground',
            {
              'debug-screens': process.env.NODE_ENV === 'development',
            },
            geistSans.variable,
            geistMono.variable,
            'antialiased'
          )}
        >
          <main>{children}</main>
        </body>

      </ClerkProvider>
    </html>
  );
}
