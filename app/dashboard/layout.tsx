import { Poppins } from 'next/font/google';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ComboboxDemo } from '@/components/layout/combobox';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { ModeToggle } from '@/components/layout/dark-model-toggle';
import { BusinessProvider } from '@/app/context/BusinessContext';
import { Toaster } from '@/components/ui/toaster';
import { SignedIn, UserButton, SignedOut } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
// import '@/app/globals.css';
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hide-scrollbar">

    <SignedIn>
      <div className={`${poppins.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <BusinessProvider>
            <SidebarProvider className="ml-8 my-0">
              <AppSidebar />
              <main className="flex-1 p-6">
                <SidebarTrigger />
                <div className="absolute top-0 right-0 p-4 flex space-x-4">
                  <ComboboxDemo />
                  <UserButton />
                  <ModeToggle />
                </div>
                {children}
              </main>
              <Toaster />
            </SidebarProvider>
          </BusinessProvider>
        </ThemeProvider>
      </div>
    </SignedIn>
<SignedOut>
        redirect('/landingPage');
</SignedOut>
    </div>

  );
}
