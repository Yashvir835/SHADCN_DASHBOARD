import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils"; // Ensure this is properly imported and defined
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ComboboxDemo } from "@/components/combobox";
import { ReactNode } from "react";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${cn(
          "min-h-screen w-full text-black flex",
          {
            "debug-screens": process.env.NODE_ENV === "development",
          }
        )} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider className="ml-8 my-0">
          <AppSidebar />
          <main className="flex-1 p-6">
            <SidebarTrigger />
           
            <div className="mb-6">
              {/* having issue in this component */}
              {/* <CalenderComponent /> */}
            </div>
            <div className="absolute top-0 right-0 p-4">
              <ComboboxDemo />
            </div>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
