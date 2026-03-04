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

export default function LatencyGraph() {
  const { fetchPingData, currentMonitor, isLoadingPingData, pingData } =
    useMonitorStore();

  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.Week);

  useEffect(() => {
    fetchPingData(currentMonitor!.id, timeRange);
  }, [fetchPingData, timeRange]);

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
    <Card className="min-h-96">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg">Response Time</CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={() => setTimeRange(TimeRange.Day)}
            variant={"outline"}
            className={`${timeRange == TimeRange.Day ? "bg-[#eaecf1]" : ""}`}
          >
            Day
          </Button>
          <Button
            onClick={() => setTimeRange(TimeRange.Week)}
            variant={"outline"}
            className={`${timeRange == TimeRange.Week ? "bg-[#eaecf1]" : ""}`}
          >
            Week
          </Button>
          <Button
            onClick={() => setTimeRange(TimeRange.Month)}
            variant={"outline"}
            className={`${timeRange == TimeRange.Month ? "bg-[#eaecf1]" : ""}`}
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
                      hour: "numeric",
                    });
                  } else {
                    return date.toLocaleDateString("en-IN", {
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
                tickMargin={10}
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
                fill="#afcfff"
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
