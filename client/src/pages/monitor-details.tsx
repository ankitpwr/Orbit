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
  TriangleAlert,
} from "lucide-react";
import { Button } from "../components/ui/button";
import StatsCard from "../components/stats-card";
import { formatDistanceToNow } from "date-fns";
import StatusBadge from "../components/status-badge";

export default function MonitorDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { fetchCurrentMonitor, isLoadingCurrentMonitor, currentMonitor } =
    useMonitorStore();

  useEffect(() => {
    if (!id) {
      toast.error("Not a valid route", { position: "bottom-right" });
      return;
    } else fetchCurrentMonitor(id);
  }, []);

  if (isLoadingCurrentMonitor) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  let lc = "";
  if (currentMonitor?.lastChecked) {
    lc = formatDistanceToNow(currentMonitor!.lastChecked, {
      addSuffix: true,
    });
  }

  if (!currentMonitor) return;

  return (
    <div className=" w-full h-full flex flex-col pl-30 pr-51 pt-20 font-montserrat gap-10 overflow-hidden">
      <div className="flex w-full justify-between ">
        <div className="flex flex-col ">
          <div className="flex items-center gap-4 ">
            <h1 className="text-3xl font-bold">{currentMonitor?.name}</h1>
            <StatusBadge status={`${currentMonitor.status}`} />
          </div>
          <div className=" flex items-center gap-2 cursor-pointer ">
            <Link size={16} />
            <span>{currentMonitor?.url}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant={"outline"} className="">
            {currentMonitor?.status != "PAUSED" ? (
              <div className="flex  items-center gap-2 justify-center">
                <Pause /> <span>Pause</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <Play />
                <span>Play</span>
              </div>
            )}
          </Button>
          <Button
            variant={"destructive"}
            className="bg-red-100 text-red-500 hover:bg-red-200"
          >
            <Trash /> <span>Delete</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-8 ">
        <StatsCard
          icon={<Activity color="green" size={30} />}
          title="Currently up for"
          details={`${formatDistanceToNow(currentMonitor!.createdAt, {
            addSuffix: true,
          })}`}
        />
        <StatsCard
          icon={<CircleCheck size={30} color="orange" />}
          title="Last checked"
          details={`${lc}`}
        />
        <StatsCard
          icon={<Radio color="blue" size={30} />}
          title="Averge Latency"
          details={`${currentMonitor?.lastlatency}ms`}
        />
      </div>
    </div>
  );
}
