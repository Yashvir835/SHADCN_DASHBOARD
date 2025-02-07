'use client';
import { Navbar } from '@/app/landingPage/_components/NavBar';
import { Poppins } from 'next/font/google';
import PageTransitionLayout from '@/app/landingPage/_components/PageTransitionLayout';
import { SignedIn, SignedOut  } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import '@/app/globals.css';
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <SignedOut>
        <div className={`${poppins.className}`}>
          <Navbar />
          <PageTransitionLayout>
            <main className="relative h-screen hide-scrollbar">{children}</main>
          </PageTransitionLayout>
        </div>
    </SignedOut>
      <SignedIn>
        redirect('/dashboard');
 </SignedIn>
    </>

  );
}
