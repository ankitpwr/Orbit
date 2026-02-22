import React, { useEffect, useState } from "react";
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
import { CircleSlash, Icon } from "lucide-react";
//

export default function LatencyGraph() {
  const { fetchPingData, currentMonitor, isLoadingPingData, pingData } =
    useMonitorStore();

  const [timeRange, setTimeRange] = useState<1 | 7>(7);

  useEffect(() => {
    fetchPingData(currentMonitor!.id, 7);
  }, [fetchPingData, currentMonitor?.id]);

  if (isLoadingPingData) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!pingData || pingData.length == 0) {
    return <div className="flex items-center justify-center">Nothing</div>;
  }

  const daysOld = new Date();
  daysOld.setDate(daysOld.getDate() - timeRange);

  const data = pingData
    .filter((obj) => {
      const itemDate = new Date(obj.timestamp);
      return itemDate > daysOld;
    })
    .map((obj, index) => {
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
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Response Time</CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={() => setTimeRange(1)}
            variant={"outline"}
            className={`${timeRange == 1 ? "bg-[#eaecf1]" : ""}`}
          >
            Day
          </Button>
          <Button
            onClick={() => setTimeRange(7)}
            variant={"outline"}
            className={`${timeRange == 7 ? "bg-[#eaecf1]" : ""}`}
          >
            Week
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
                    return date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                    });
                  } else {
                    return date.toLocaleDateString("en-US", {
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
                      return date.toLocaleString("en-US", {
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
