import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import useMonitorStore from "../store/useMonitorStore";
import MonitorCard from "../components/monitor-card";
import NoMonitor from "../components/no-monitor";
import { Spinner } from "../components/ui/spinner";

export default function Monitors() {
  const navigate = useNavigate();
  const { userMonitors, fetchUserMonitors, isLoadingMonitors } =
    useMonitorStore();
  console.log("usermonitors ", userMonitors);

  useEffect(() => {
    fetchUserMonitors();
  }, [fetchUserMonitors]);
  return (
    <div className="w-full h-full flex flex-col px-30 pt-20 font-montserrat gap-10">
      <div className="w-full flex justify-between ">
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
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="size-12" />
        </div>
      ) : userMonitors.length != 0 ? (
        userMonitors.map((data, index) => (
          <MonitorCard
            key={index}
            id={data.id}
            name={data.name}
            url={data.url}
            createdAt={data.createdAt}
            status={data.status}
          />
        ))
      ) : (
        <NoMonitor />
      )}
    </div>
  );
}
