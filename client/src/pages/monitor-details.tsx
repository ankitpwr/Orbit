import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMonitorStore from "../store/useMonitorStore";
import { toast } from "sonner";
import { Spinner } from "../components/ui/spinner";
import {
  Activity,
  CircleCheck,
  Link,
  Pause,
  Play,
  Radio,
  Trash,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import StatsCard from "../components/stats-card";
import { formatDistanceToNow } from "date-fns";
import StatusBadge from "../components/status-badge";
import LatencyGraph from "../components/latency-graph";
import StatusHeatmap from "../components/status-heatmap";

export default function MonitorDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    fetchCurrentMonitor,
    isLoadingCurrentMonitor,
    currentMonitor,
    changeStatus,
    averageLatency,
    deleteMonitor,
  } = useMonitorStore();

  useEffect(() => {
    console.log("useEffect ran!");
    if (!id) {
      toast.error("Not a valid route", { position: "bottom-right" });
    } else {
      fetchCurrentMonitor(id);
    }
  }, [id, fetchCurrentMonitor]);

  if (isLoadingCurrentMonitor || currentMonitor?.id !== id) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  if (!currentMonitor) return;

  return (
    <div className=" w-full h-full flex flex-col pl-30 pr-51 pt-20 pb-30 font-montserrat gap-10 overflow-hidden">
      <div className="flex w-full justify-between ">
        <div className="flex flex-col ">
          <div className="flex items-center gap-4 ">
            <h1 className="text-3xl font-bold">{currentMonitor?.name}</h1>
            <StatusBadge status={`${currentMonitor.status}`} />
          </div>
          <div
            onClick={() => window.open(currentMonitor.url, "_blank")}
            className=" flex items-center gap-2 cursor-pointer "
          >
            <Link size={16} />
            <span>{currentMonitor.url}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              currentMonitor.status == "PAUSED"
                ? changeStatus(currentMonitor.id, "UP")
                : changeStatus(currentMonitor.id, "PAUSED");
            }}
            variant={"outline"}
            className=""
          >
            {currentMonitor.status != "PAUSED" ? (
              <div className="flex  items-center gap-2 justify-center">
                <Pause />
                <span>Pause</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <Play />
                <span>Start</span>
              </div>
            )}
          </Button>
          <Button
            onClick={() => {
              try {
                deleteMonitor(currentMonitor.id);
                navigate("/dashboard/monitors");
              } catch (error) {}
            }}
            variant={"destructive"}
            className="bg-red-100 text-red-500 hover:bg-red-200"
          >
            <Trash /> <span>Delete</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-8 ">
        <StatsCard
          icon={
            currentMonitor.status == "UP" ? (
              <TrendingUp color="green" size={30} />
            ) : currentMonitor.status == "DOWN" ? (
              <TrendingDown color="red" size={30} />
            ) : (
              <Activity color="orange" size={30} />
            )
          }
          title={`${currentMonitor.status == "UP" ? "Currently up for" : currentMonitor.status == "DOWN" ? "Currently down for" : "Currently paused for"}`}
          details={`${formatDistanceToNow(currentMonitor!.statusChangedAt, {
            addSuffix: false,
          })}`}
        />
        <StatsCard
          icon={<CircleCheck size={30} />}
          title="Last checked"
          details={`${formatDistanceToNow(currentMonitor!.lastChecked, {
            addSuffix: true,
          })}`}
        />
        <StatsCard
          icon={<Radio color="blue" size={30} />}
          title="Averge Latency"
          details={`${Math.round(averageLatency)}ms`}
        />
      </div>
      <LatencyGraph />
      <div className="flex flex-col w-full text-lg ">
        <h1 className="font-semibold">Uptime in last 30 days</h1>
        <StatusHeatmap />
      </div>
    </div>
  );
}
