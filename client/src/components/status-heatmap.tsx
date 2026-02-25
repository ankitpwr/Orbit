import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import useMonitorStore from "../store/useMonitorStore";
import { TimeRange } from "../lib/types";
import { Skeleton } from "./ui/skeleton";
import { uptimePercentage, type ReturnType } from "../lib/uptimepercent";

export default function StatusHeatmap() {
  const { fetchPingData, currentMonitor, isLoadingPingData, pingData } =
    useMonitorStore();

  const [heatmapData, setHeatMapData] = useState<ReturnType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPingData(currentMonitor!.id, TimeRange.Month);
  }, [fetchPingData]);

  useEffect(() => {
    setLoading(true);
    if (pingData) {
      const data = uptimePercentage(pingData);
      setHeatMapData(data);
    }
    setLoading(false);
  }, [pingData]);

  if (isLoadingPingData || loading) {
    return <Skeleton className="h-4 w-full" />;
  }

  console.log("heatmap data", heatmapData);

  return (
    <div className="flex gap-[6px] h-fit w-full bg-[#f8f9fc] border border-[#dfe3ea] px-4  py-2 rounded-lg">
      {heatmapData.map((day, i) => (
        <Tooltip key={i}>
          <TooltipTrigger>
            <div
              className={`h-10 w-3 rounded-sm flex-1 cursor-pointer ${day.uptimepercent > 97 ? "bg-green-500" : "bg-red-500"}`}
            ></div>
          </TooltipTrigger>
          <TooltipContent className="text-sm">
            <p>Date:- {day.date}</p>
            <p>uptime:- {Math.floor(day.uptimepercent)}%</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
