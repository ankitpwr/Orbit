import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import useMonitorStore from "../store/useMonitorStore";
import MonitorCard from "../components/monitor-card";
import NoMonitor from "../components/no-monitor";
import { Spinner } from "../components/ui/spinner";
import { Skeleton } from "../components/ui/skeleton";

export default function Monitors() {
  const navigate = useNavigate();
  const { userMonitors, fetchUserMonitors, isLoadingMonitors } =
    useMonitorStore();

  useEffect(() => {
    fetchUserMonitors();
  }, [fetchUserMonitors]);
  return (
    <div className="w-full h-full flex flex-col md:px-30 md:pt-20 px-5 py-10 font-montserrat gap-10">
      <div className="md:w-full w-fit flex md:flex-row flex-col justify-between md:gap-0 gap-2">
        <h1 className="text-3xl font-bold">Monitors</h1>
        <Button
          variant={"default"}
          size={"lg"}
          onClick={() => navigate("/dashboard/monitors/new")}
        >
          {" "}
          Create monitor
        </Button>
      </div>
      {isLoadingMonitors == true ? (
        <div className="w-full h-full flex flex-col gap-8 items-center">
          <Skeleton className="w-full h-22 rounded-lg border border-[#dfe3ea] dark:border-[#2e2f2f]  shadow-[1px_6px_10px_-4px_rgba(0,_0,_0,_0.1)]" />
          <Skeleton className="w-full h-22 rounded-lg border border-[#dfe3ea] dark:border-[#2e2f2f]  shadow-[1px_6px_10px_-4px_rgba(0,_0,_0,_0.1)]" />
          <Skeleton className="w-full h-22 rounded-lg border border-[#dfe3ea] dark:border-[#2e2f2f]  shadow-[1px_6px_10px_-4px_rgba(0,_0,_0,_0.1)]" />
        </div>
      ) : userMonitors.length != 0 ? (
        userMonitors.map((data, index) => (
          <MonitorCard
            key={index}
            id={data.id}
            name={data.name}
            url={data.url}
            status={data.status}
          />
        ))
      ) : (
        <NoMonitor />
      )}
    </div>
  );
}
