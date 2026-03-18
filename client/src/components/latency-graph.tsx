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
  console.log("theme is  ", theme);

  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.Week);

  useEffect(() => {
    if (!currentMonitor) return;
    fetchPingData(currentMonitor.id, timeRange);
  }, [fetchPingData, timeRange, currentMonitor]);

  if (!pingData) {
    return <div className="flex items-center justify-center">Nothing</div>;
  }

  const daysOld = new Date();
  daysOld.setDate(daysOld.getDate() - timeRange);

  const data = pingData.map((obj, index) => {
    let latency = obj.latency;
    let date = obj.timestamp;
    return { date: date, latency: latency };
  });

  const chartConfig = {
    latency: {
      label: "latency",
      color: "blue",
    },
  } satisfies ChartConfig;

  return (
    <Card className="">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="md:text-lg text-xs">Response Time</CardTitle>
        <div className="flex md:gap-2 gap-1">
          <Button
            size={"sm"}
            onClick={() => setTimeRange(TimeRange.Day)}
            variant={"outline"}
            className={`text-xs ${timeRange == TimeRange.Day ? "bg-[#eaecf1]" : ""}`}
          >
            Day
          </Button>
          <Button
            size={"sm"}
            onClick={() => setTimeRange(TimeRange.Week)}
            variant={"outline"}
            className={`text-xs ${timeRange == TimeRange.Week ? "bg-[#eaecf1]" : ""}`}
          >
            Week
          </Button>
          <Button
            size="sm"
            onClick={() => setTimeRange(TimeRange.Month)}
            variant={"outline"}
            className={`text-xs ${timeRange == TimeRange.Month ? "bg-[#eaecf1]" : ""}`}
          >
            Month
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.length != 0 ? (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 10,
                right: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                minTickGap={40}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (timeRange === 1) {
                    return date.toLocaleTimeString("en-IN", {
                      timeZone: user!.timezone,
                      hour: "numeric",
                    });
                  } else {
                    return date.toLocaleDateString("en-IN", {
                      timeZone: user!.timezone,
                      month: "short",
                      day: "numeric",
                    });
                  }
                }}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) => `${value}ms`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleString("en-IN", {
                        timeZone: user!.timezone,
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
                type="linear"
                fill={theme == "light" ? "#afcfff" : "#204277"}
                fillOpacity={0.4}
                stroke="#2b7fff"
              />
            </AreaChart>
          </ChartContainer>
        ) : isLoadingPingData == true ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CircleSlash />
                </EmptyMedia>
                <EmptyTitle>Empty</EmptyTitle>
                <EmptyDescription>
                  No response times data available
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent></EmptyContent>
            </Empty>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
