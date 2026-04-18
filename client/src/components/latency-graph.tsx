import { useEffect, useState } from "react";
import useMonitorStore from "../store/useMonitorStore";
import { Spinner } from "./ui/spinner";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";
import { Button } from "./ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { CircleSlash } from "lucide-react";
import { TimeRange } from "../lib/types";
import useAuthStore from "../store/useAuthStore";
import { useTheme } from "./theme-provider";

export default function LatencyGraph() {
  const { fetchPingData, currentMonitor, isLoadingPingData, pingData } =
    useMonitorStore();
  const { user } = useAuthStore();
  const { theme } = useTheme();

  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.Week);

  useEffect(() => {
    if (!currentMonitor) return;
    fetchPingData(currentMonitor.id, timeRange);
  }, [fetchPingData, timeRange, currentMonitor?.id]);

  if (!pingData) return null;

  const data = pingData.map((obj) => ({
    date: obj.timestamp,
    latency: obj.latency,
  }));

  const chartConfig = {
    latency: {
      label: "Latency",
      color: "blue",
    },
  } satisfies ChartConfig;

  const getButtonStyles = (range: TimeRange) => {
    return timeRange === range
      ? "bg-gray-100 text-gray-900 dark:bg-[#2e2f2f] dark:text-white"
      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white";
  };

  return (
    <Card className="w-full rounded-xl border-gray-200 dark:border-[#2e2f2f] bg-white dark:bg-[#121212] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 md:pb-4 border-b border-transparent">
        <CardTitle className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
          Response Time
        </CardTitle>
        <div className="flex gap-1.5 p-1 rounded-md bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2e2f2f]">
          <Button
            size="sm"
            onClick={() => setTimeRange(TimeRange.Day)}
            variant="ghost"
            className={`h-7 px-3 text-xs rounded-sm transition-colors ${getButtonStyles(TimeRange.Day)}`}
          >
            Day
          </Button>
          <Button
            size="sm"
            onClick={() => setTimeRange(TimeRange.Week)}
            variant="ghost"
            className={`h-7 px-3 text-xs rounded-sm transition-colors ${getButtonStyles(TimeRange.Week)}`}
          >
            Week
          </Button>
          <Button
            size="sm"
            onClick={() => setTimeRange(TimeRange.Month)}
            variant="ghost"
            className={`h-7 px-3 text-xs rounded-sm transition-colors ${getButtonStyles(TimeRange.Month)}`}
          >
            Month
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-2 px-2 md:px-6">
        {data.length !== 0 ? (
          <ChartContainer
            config={chartConfig}
            className="h-[300px] md:h-[360px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ left: 2, right: 10, top: 10, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#2e2f2f" : "#e5e7eb"}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={40}
                tick={{
                  fontSize: 12,
                  fill: theme === "dark" ? "#9ca3af" : "#6b7280",
                }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (timeRange === TimeRange.Day) {
                    return date.toLocaleTimeString("en-IN", {
                      timeZone: user?.timezone,
                      hour: "numeric",
                    });
                  }
                  return date.toLocaleDateString("en-IN", {
                    timeZone: user?.timezone,
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{
                  fontSize: 12,
                  fill: theme === "dark" ? "#9ca3af" : "#6b7280",
                }}
                tickFormatter={(value) => `${value}ms`}
              />
              <ChartTooltip
                cursor={{
                  stroke: theme === "dark" ? "#4b5563" : "#d1d5db",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2e2f2f]"
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleString("en-IN", {
                        timeZone: user?.timezone,
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      });
                    }}
                    formatter={(value) => `${value}ms`}
                  />
                }
              />
              <Area
                dataKey="latency"
                type="monotone"
                fill={theme === "light" ? "#5b63d320" : "#5b63d330"}
                fillOpacity={1}
                stroke="#5b63d3"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : isLoadingPingData ? (
          <div className="flex h-[250px] items-center justify-center">
            <Spinner className="text-[#5b63d3]" />
          </div>
        ) : (
          <div className="flex h-[250px] items-center justify-center">
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
                  No response time data available for this range.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
