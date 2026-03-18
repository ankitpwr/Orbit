import React from "react";
import { Badge } from "./ui/badge";
import type { MonitorStatus } from "../lib/types";

export default function StatusBadge({ status }: { status: MonitorStatus }) {
  if (status == "UP") {
    return (
      <Badge
        variant={"secondary"}
        className="bg-green-200 text-green-600 md:text-xs text-[10px]  "
      >
        <span>Up</span>
      </Badge>
    );
  } else if (status == "DOWN") {
    return (
      <Badge
        variant={"secondary"}
        className="bg-red-200 text-red-600 md:text-xs text-[10px] "
      >
        <span>Down</span>
      </Badge>
    );
  } else {
    return (
      <Badge variant={"secondary"} className="bg-orange-200 text-orange-600 ">
        <span>Paused</span>
      </Badge>
    );
  }
}
