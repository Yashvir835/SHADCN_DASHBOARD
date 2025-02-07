import { AreaChart } from "@/components/charts/AreaChart";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { RecentSales } from "./RecentSales";

function Graph() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2 w-full">
      <div className="p-2">
        <BarChart />
      </div>
      <div className="p-2">
        <div className="border rounded-lg flex items-center text-lg p-4">
          <RecentSales />
        </div>
      </div>
      <div className="p-2">
        <AreaChart />
      </div>
      <div className="p-2">
        <PieChart />
      </div>
    </div>
  );
}

export default Graph;
