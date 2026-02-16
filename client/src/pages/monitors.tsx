import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import useMonitorStore from "../store/useMonitorStore";
import MonitorCard from "../components/monitor-card";

export default function Monitors() {
  const navigate = useNavigate();
  const { userMonitors, fetchUserMonitors } = useMonitorStore();

  useEffect(() => {
    fetchUserMonitors();
  }, [fetchUserMonitors]);
  return (
    <div className="w-full h-full flex flex-col px-30 pt-20 font-montserrat gap-10">
      <div className="w-full flex justify-between bg-amber-300">
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
      <MonitorCard />
    </div>
  );
}
