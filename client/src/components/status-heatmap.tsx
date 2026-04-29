import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import useMonitorStore from "../store/useMonitorStore";
import { TimeRange } from "../lib/types";
import { Skeleton } from "./ui/skeleton";
import { uptimePercentage, type ReturnType } from "../lib/uptimepercent";
import useAuthStore from "../store/useAuthStore";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { CircleSlash } from "lucide-react";

export default function StatusHeatmap() {
  const {
    fetchHeatMapData,
    currentMonitor,
    isLoadingHeatMapData,
    heatMapData,
  } = useMonitorStore();
  const { user } = useAuthStore();

  const [heatmapData, setHeatMapData] = useState<ReturnType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentMonitor) return;
    fetchHeatMapData(currentMonitor.id, TimeRange.Month);
  }, [fetchHeatMapData, currentMonitor]);

  useEffect(() => {
    setLoading(true);
    if (heatMapData) {
      const data = uptimePercentage(heatMapData, user!.timezone);
      setHeatMapData(data);
    }
    setLoading(false);
  }, [heatMapData]);

  if (isLoadingHeatMapData || loading) {
    return <Skeleton className="h-15 w-full" />;
  }

  if (heatMapData?.length == 0) {
    return (
      <div className="flex h:[50px] md:h-[100px] items-center justify-center">
        <Empty className="border-none shadow-none bg-transparent">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="bg-gray-100 dark:bg-[#1e1e1e] text-gray-500"
            >
              <CircleSlash />
            </EmptyMedia>
            <EmptyTitle className="text-gray-900 dark:text-white">
              No Data
            </EmptyTitle>
            <EmptyDescription className="text-gray-500 dark:text-gray-400">
              Please wait for some time
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex md:gap-[6px] gap-[4px] h-fit w-full bg-[#f8f9fc] dark:bg-[#171717] border border-[#dfe3ea] dark:border-[#2e2f2f]  px-4  py-2 rounded-lg">
      {heatmapData.map((day, i) => (
        <Tooltip key={i}>
          <TooltipTrigger>
            <div
              className={`h-10 w-[6px] md:w-2 rounded-sm flex-1 cursor-pointer ${day.uptimepercent > 95 ? "bg-green-500  dark:bg-green-700 " : "bg-red-500 dark:bg-red-700 "}`}
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
