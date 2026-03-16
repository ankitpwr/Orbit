import { ShieldCheckIcon } from "lucide-react";
import React from "react";
import IncidentBadge from "./incident-badge";
import type { Incident } from "../lib/types";
import useAuthStore from "../store/useAuthStore";

export default function IncidentCard({
  monitorName,
  url,
  startedAt,
  resolvedAt,
  currentStatus,
}: Incident) {
  const { user } = useAuthStore();
  return (
    <div className="w-full font-montserrat rounded-lg flex flex-col  justify-center  border border-[#dfe3ea]  cursor-pointer shadow-[1px_6px_10px_-4px_rgba(0,_0,_0,_0.1)]">
      <div className="grid grid-cols-4  items-center py-4 px-5">
        <div className="col-span-2 flex items-center  gap-4">
          <IncidentBadge status={currentStatus} />
          <div className="flex flex-col ">
            <span>{monitorName}</span>
            <span className="text-sm">{url}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span>Started at</span>
          <span className="text-sm">
            {new Date(startedAt).toLocaleString("en-IN", {
              timeZone: user?.timezone,
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </div>

        <div className="flex flex-col  items-end ">
          {currentStatus == "RESOLVED" ? (
            <span className="text-green-600">Resolved</span>
          ) : (
            <span className="text-red-600">Ongoing</span>
          )}
        </div>
      </div>
    </div>
  );
}
