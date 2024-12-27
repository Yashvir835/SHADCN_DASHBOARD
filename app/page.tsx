import Image from "next/image";
import CardComponent from "./MyComponents/Card";
// import CalendarDemo from "./MyComponents/Calender";
// import { ModeToggle } from "@/components/ui/mode-toggle";
import Graph from "./MyComponents/Graph";
export default function Home() {
  return (
    <div className="p-6">
 <p className="text-lg font-bold mb-4">Hi, Welcome back 👋</p>
            <div className="flex gap-4 mb-6">
              <button className="px-2 max-w-96 py-2 bg-[#faeddc] text-[#3a3a3a] border-2 rounded-lg">
                <span className="bg-white p-2 border-2 rounded-lg max-w-48">Overview</span>
                <span className="px-4 ml-4 text-lg py-2 text-black rounded-lg">
                  Analytics
                </span>
              </button>
            </div>
      {/* <CalendarDemo/> */}
      <CardComponent />
      <Graph/>
    </div>
  );
}
