import { AreaChart } from "@/components/charts/AreaChart";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { RecentSales } from "./RecentSales";

function Graph() {
  return (
    <div className="flex flex-wrap mt-2 w-full">
 <div className="w-full min-h-[300px] lg:w-1/2 p-2">       
          <BarChart />
        
      </div>

      <div className="w-full lg:w-1/2 p-2">
        <div className="border rounded-lg min-h-[450px] flex items-center text-lg">
          <RecentSales />
        </div>
      </div>

    <div className="w-full min-h-[300px] lg:w-1/2 p-2">
        
          <AreaChart />
        
      </div>

      <div className="w-full min-h-[300px] lg:w-1/2 p-2">
       
          <PieChart />

      </div>
    </div>
  );
}

export default Graph;
