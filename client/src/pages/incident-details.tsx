import { useEffect } from "react";
import useIncidentStore from "../store/useIncidentStore";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../components/ui/spinner";
import { AlertCircle, Ban, BellRing, LinkIcon } from "lucide-react";

import { Button } from "../components/ui/button";
import StatsCard from "../components/stats-card";
import useAuthStore from "../store/useAuthStore";
import { Badge } from "../components/ui/badge";
import { formatDistance } from "date-fns";

export default function IncidentDetails() {
  const {
    selectedIncident,
    isLoadingIncidentData,
    fetchIncidentData,
    updateStatus,
  } = useIncidentStore();
  const { user } = useAuthStore();
  const { incidentId } = useParams();
  const naviagate = useNavigate();

  useEffect(() => {
    if (!incidentId) return;
    fetchIncidentData(incidentId);
  }, [incidentId]);

  if (isLoadingIncidentData || !selectedIncident) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  if (!incidentId) {
    naviagate("/");
    return;
  }

  return (
    <div className=" w-full h-full flex flex-col md:px-20 md:pt-20 px-5 py-10 font-montserrat gap-10 overflow-hidden">
      <div className="flex md:flex-row flex-col w-full justify-between  md:gap-0 gap-4">
        <div className="flex flex-col  gap-1 ">
          <div className="flex gap-3 items-center ">
            <h1 className="text-3xl font-bold">
              {selectedIncident.monitorName}
            </h1>
            <Badge
              className={`w-fit h-fit ${selectedIncident.currentStatus == "RESOLVED" ? "bg-green-200 text-green-600" : selectedIncident.currentStatus == "ACKNOWLEDGED" ? "bg-orange-200 text-orange-600" : "bg-red-200 text-red-600"}`}
            >
              {selectedIncident.currentStatus == "OPEN"
                ? "Ongoing"
                : `${
                    selectedIncident.currentStatus.charAt(0).toUpperCase() +
                    selectedIncident.currentStatus.slice(1).toLocaleLowerCase()
                  }`}
            </Badge>
          </div>
          <div
            onClick={() => window.open(selectedIncident.url, "_blank")}
            className=" flex items-center gap-2 cursor-pointer "
          >
            <LinkIcon size={16} />
            <span className="text-sm">{selectedIncident.url}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedIncident.currentStatus == "OPEN" ? (
            <Button
              onClick={() => {
                updateStatus("ACKNOWLEDGED", incidentId);
              }}
              variant={"outline"}
            >
              Acknowledge
            </Button>
          ) : selectedIncident.currentStatus == "ACKNOWLEDGED" ? (
            <Button
              onClick={() => {
                updateStatus("RESOLVED", incidentId);
              }}
              variant={"outline"}
            >
              Resolve
            </Button>
          ) : (
            <Button
              onClick={() => {
                updateStatus("OPEN", incidentId);
              }}
              variant={"outline"}
            >
              Reopen
            </Button>
          )}
        </div>
      </div>
      <div className="flex md:flex-row flex-col items-center gap-8 ">
        <StatsCard
          icon={<AlertCircle size={26} />}
          title="Started at"
          details={`${new Date(selectedIncident.startedAt).toLocaleString(
            "en-In",
            {
              timeZone: user?.timezone,
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            },
          )}`}
        />

        <StatsCard
          icon={<BellRing size={26} />}
          title="Last alert sent at "
          details={`${new Date(selectedIncident.lastAlertSentAt).toLocaleString(
            "en-In",
            {
              timeZone: user?.timezone,
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            },
          )}`}
        />

        <StatsCard
          icon={<Ban size={26} />}
          title="Length"
          details={`${
            selectedIncident.resolvedAt != null
              ? `${formatDistance(selectedIncident.resolvedAt, selectedIncident.startedAt)}`
              : `${selectedIncident.currentStatus.charAt(0).toUpperCase() + selectedIncident.currentStatus.slice(1).toLocaleLowerCase()}`
          }`}
        />
      </div>
    </div>
  );
}
