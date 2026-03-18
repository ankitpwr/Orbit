import { useEffect } from "react";
import useIncidentStore from "../store/useIncidentStore";
import useAuthStore from "../store/useAuthStore";
import { Spinner } from "../components/ui/spinner";
import IncidentCard from "../components/incident-card";

export default function Incidents() {
  const { isLoadingIncidents, fetchIncidents, incidents } = useIncidentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchIncidents();
  }, []);

  console.log(isLoadingIncidents);
  if (isLoadingIncidents) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:px-30 md:pt-20 px-5 py-10 font-montserrat text-sm gap-10">
      <div className="flex">
        <h1 className="text-3xl font-bold">Incidents</h1>
      </div>

      <div className="flex flex-col gap-8">
        {incidents.map((i, index) => (
          <IncidentCard
            key={index}
            monitorName={i.monitorName}
            url={i.url}
            startedAt={i.startedAt}
            currentStatus={i.currentStatus}
            resolvedAt={i.resolvedAt}
          />
        ))}
      </div>
    </div>
  );
}
