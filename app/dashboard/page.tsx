// import Image from "next/image";
import CardComponent from "@/app/MyComponents/Card";
import { CalendarDateRangePicker } from "@/components/layout/calander";
import Graph from "@/app/MyComponents/Graph";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  return (
    <div className="min-h-screen  scrollbar-hide flex flex-col p-6 ">
      {/* Header area */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <p className="text-lg font-bold mb-4">Hi, Welcome back 👋</p>
          <div className="flex gap-4">
            {/* The Tabs component  grows naturally using flex-1 */}
            <Tabs defaultValue="overview" className="flex-1">
              <TabsList className="h-12 p-1 bg-muted/20 rounded-full">
                <TabsTrigger
                  value="overview"
                  className="rounded-full px-8 text-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="rounded-full px-8 text-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        {/* Control area using flex gap and margin */}
        <div className="flex gap-2">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      {/* Main content area without scrolling */}
      <div className="flex-1 ">
        <CardComponent />
        <Graph />
      </div>
    </div>
  );
}
