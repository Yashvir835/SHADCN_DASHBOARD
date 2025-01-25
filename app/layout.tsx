import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ComboboxDemo } from "@/components/layout/combobox";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/layout/theme-provider"
import { ModeToggle } from "@/components/layout/dark-model-toggle";
import LandingPage from "./MyComponents/landingPage";
import ShineBorder from "@/components/ui/shine-border";
import { BusinessProvider } from "@/app/context/BusinessContext";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Button } from "@/components/ui/button";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Nexus Beings",
  description: "Revolutionizing the world of digital humans",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen w-full bg-background text-foreground",
            {
              "debug-screens": process.env.NODE_ENV === "development",
            },
            geistSans.variable,
            geistMono.variable,
            "antialiased"
          )}
        >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"

        >
          <SignedIn>
              <BusinessProvider>
          <SidebarProvider className="ml-8 my-0">
            <AppSidebar />
            <main className="flex-1 p-6">
              <SidebarTrigger />

              <div className="mb-6">
                {/* having issue in this component */}
                {/* <CalenderComponent /> */}
              </div>
              <div className="absolute top-0 right-0 p-4 flex space-x-4">
                <ComboboxDemo />
                {/* <DropdownMenuDemo /> */}
           
                
            
                  <UserButton />
                <ModeToggle />

              </div>

              {children}


            </main>
          </SidebarProvider>
                </BusinessProvider>
          </SignedIn>
        </ThemeProvider>
          <SignedOut>
            <LandingPage />
            <div className="fixed top-4 z-50 right-4 flex items-center space-x-4">
              {/* <ModeToggle /> */}
              <SignInButton mode="modal">
                <button>
                  <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
                  Sign In
                </ShineBorder>
                </button>
              </SignInButton>
            </div>
          </SignedOut>
      </body>
    </html>
    </ClerkProvider>

  );
}
