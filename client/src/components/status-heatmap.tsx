import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import useMonitorStore from "../store/useMonitorStore";
import { TimeRange } from "../lib/types";
import { Skeleton } from "./ui/skeleton";
import { uptimePercentage, type ReturnType } from "../lib/uptimepercent";

export default function StatusHeatmap() {
  const {
    fetchHeatMapData,
    currentMonitor,
    isLoadingHeatMapData,
    heatMapData,
  } = useMonitorStore();

  const [heatmapData, setHeatMapData] = useState<ReturnType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentMonitor) return;
    fetchHeatMapData(currentMonitor.id, TimeRange.Month);
  }, [fetchHeatMapData, currentMonitor]);

  useEffect(() => {
    setLoading(true);
    if (heatMapData) {
      const data = uptimePercentage(heatMapData);
      setHeatMapData(data);
    }
    setLoading(false);
  }, [heatMapData]);

  if (isLoadingHeatMapData || loading) {
    return <Skeleton className="h-4 w-full" />;
  }

  return (
    <div className="flex gap-[6px] h-fit w-full bg-[#f8f9fc] border border-[#dfe3ea] px-4  py-2 rounded-lg">
      {heatmapData.map((day, i) => (
        <Tooltip key={i}>
          <TooltipTrigger>
            <div
              className={`h-10 w-3 rounded-sm flex-1 cursor-pointer ${day.uptimepercent > 95 ? "bg-green-500" : "bg-red-500"}`}
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
