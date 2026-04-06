import { useEffect } from "react";
import useIncidentStore from "../store/useIncidentStore";
import useAuthStore from "../store/useAuthStore";
import { Spinner } from "../components/ui/spinner";
import IncidentCard from "../components/incident-card";
import { Skeleton } from "../components/ui/skeleton";

export default function Incidents() {
  const { isLoadingIncidents, fetchIncidents, incidents } = useIncidentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="w-full h-full flex flex-col md:px-30 md:pt-20 px-5 py-10 font-montserrat text-sm gap-10">
      <div className="flex">
        <h1 className="text-3xl font-bold">Incidents</h1>
      </div>
      {isLoadingIncidents == true ? (
        <div className="w-full h-full flex flex-col gap-8 items-center">
          <Skeleton className="w-full h-18 rounded-lg border border-[#dfe3ea] dark:border-[#2e2f2f]  shadow-[1px_6px_10px_-4px_rgba(0,_0,_0,_0.1)]" />
          <Skeleton className="w-full h-18 rounded-lg border border-[#dfe3ea] dark:border-[#2e2f2f]  shadow-[1px_6px_10px_-4px_rgba(0,_0,_0,_0.1)]" />
          <Skeleton className="w-full h-18 rounded-lg border border-[#dfe3ea] dark:border-[#2e2f2f]  shadow-[1px_6px_10px_-4px_rgba(0,_0,_0,_0.1)]" />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {incidents.map((i, index) => (
            <IncidentCard
              key={index}
              incidentId={i.incidentId}
              monitorName={i.monitorName}
              url={i.url}
              startedAt={i.startedAt}
              currentStatus={i.currentStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
