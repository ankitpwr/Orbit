import React, { useEffect } from "react";
import useMonitorStore from "../store/useMonitorStore";
import { Spinner } from "./ui/spinner";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";
//

export default function LatencyGraph() {
  const { fetchPingData, currentMonitor, isLoadingPingData, pingData } =
    useMonitorStore();

  useEffect(() => {
    fetchPingData(currentMonitor!.id, 7);
  }, [fetchPingData]);

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

  const data = pingData.map((obj, index) => {
    let latency = obj.latency;
    let date = obj.timestamp;
    return { date: date, latency: latency };
  });
  console.log("data is ", data);

  const chartConfig = {
    latency: {
      label: "latency",
      color: "green",
    },
  } satisfies ChartConfig;

  return (
    <div className="bg-[#f8f9fc] border-[#dfe3ea]">
      <Card>
        <CardHeader>
          <CardTitle>Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={true}
                tickMargin={10}
                tickFormatter={(value) => {
                  console.log("value is ", value);
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    hour: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
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
        </CardContent>
      </Card>
    </div>
  );
}
