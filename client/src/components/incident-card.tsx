import IncidentBadge from "./incident-badge";
import type { Incident } from "../lib/types";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function IncidentCard({
  incidentId,
  monitorName,
  url,
  startedAt,
  currentStatus,
}: Incident) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/dashboard/incidents/${incidentId}`)}
      className="w-full font-montserrat rounded-lg flex flex-col  justify-center  border border-[#dfe3ea]  dark:border-[#2e2f2f]  cursor-pointer shadow-[1px_6px_10px_-4px_rgba(0,_0,_0,_0.1)]"
    >
      <div className="grid grid-cols-4  items-center py-4 md:px-5 px-3 ">
        <div className="col-span-2 flex items-center  gap-4">
          <IncidentBadge status={currentStatus} />
          <div className="flex flex-col ">
            <span>{monitorName}</span>
            <span className="md:text-sm text-xs">{url}</span>
          </div>
        </div>

        <div className="hidden md:flex flex-col ">
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

        <div className="hidden md:flex flex-col  items-end ">
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
