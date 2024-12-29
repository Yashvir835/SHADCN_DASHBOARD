import Image from "next/image";
import CardComponent from "./MyComponents/Card";
import { CalendarDateRangePicker } from "@/components/layout/calander";
import Graph from "./MyComponents/Graph";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="p-6">
      <div className="flex ">
        <div>
          <p className="text-lg font-bold mb-4">Hi, Welcome back 👋</p>
          <div className="flex gap-4 mb-6">
            <button className="px-2 max-w-96 py-2 bg-[#faeddc] text-[#3a3a3a] border-2 rounded-lg">
              <span className="bg-white p-2 border-2 rounded-lg max-w-48">Overview</span>
              <span className="px-4 ml-4 text-lg py-2 text-black rounded-lg">
                Analytics
              </span>
            </button>
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