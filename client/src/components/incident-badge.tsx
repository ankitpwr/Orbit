import React from "react";
import type { IncidentStatus } from "../lib/types";
import { ShieldAlert, ShieldCheckIcon } from "lucide-react";

export default function IncidentBadge({ status }: { status: IncidentStatus }) {
  if (status == "RESOLVED") {
    return (
      <div className="bg-green-200 p-2 rounded-lg">
        <ShieldCheckIcon color="#00a63e" />
      </div>
    );
  } else {
    return (
      <div className="bg-red-200 p-2 rounded-lg ">
        <ShieldAlert color="#e7000b" />
      </div>
    );
  }
}
