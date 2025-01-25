import Image from "next/image";
import CardComponent from "./MyComponents/Card";
import { CalendarDateRangePicker } from "@/components/layout/calander";
import Graph from "./MyComponents/Graph";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  return (
    <div className="p-6">
      <div className="flex ">
        <div>
          <p className="text-lg font-bold mb-4">Hi, Welcome back 👋</p>
          <div className="flex gap-4 mb-6">
            <Tabs defaultValue="overview" className="w-[400px]">
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
              {/* <TabsContent value="overview">
              </TabsContent>
              <TabsContent value="analytics">
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
        <div className="flex gap-2 absolute right-0 mr-2 hidden md:flex">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <CardComponent />
      <Graph />
    </div>
  );
}