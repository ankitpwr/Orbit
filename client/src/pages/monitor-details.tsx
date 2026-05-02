import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMonitorStore from "../store/useMonitorStore";
import { toast } from "sonner";
import { Spinner } from "../components/ui/spinner";
import {
  Activity,
  CircleCheck,
  ExternalLink,
  Pause,
  Play,
  Radio,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import StatsCard from "../components/stats-card";
import { formatDistanceToNow } from "date-fns";
import StatusBadge from "../components/status-badge";
import LatencyGraph from "../components/latency-graph";
import StatusHeatmap from "../components/status-heatmap";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

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
    updateMonitorDetails,
  } = useMonitorStore();

  useEffect(() => {
    if (!id) {
      toast.error("Not a valid route", { position: "bottom-right" });
    } else {
      fetchCurrentMonitor(id);
    }
  }, [id, fetchCurrentMonitor]);

  useEffect(() => {
    if (!id) return;

    const sse = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/monitor/stream/${id}`,
      { withCredentials: true },
    );

    sse.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log("new data from SSE ", data);
      const { monitorId, statusCode, latency, timestamp } = data;
      if (
        !monitorId ||
        !statusCode ||
        !latency ||
        !timestamp ||
        monitorId != id
      )
        return;
      updateMonitorDetails(statusCode, latency, timestamp);
    };
    return () => {
      sse.close();
    };
  }, [id, updateMonitorDetails]);

  if (isLoadingCurrentMonitor || !currentMonitor || currentMonitor?.id !== id) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <Spinner className="size-10 text-[#5b63d3]" />
      </div>
    );
  }

  const handleDelete = async () => {
    const res = await deleteMonitor(currentMonitor.id);
    if (res.success) {
      navigate("/dashboard/monitors");
    } else {
      toast.error(res.message, { position: "bottom-right" });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col px-6 py-8 md:py-12 font-montserrat gap-8">
      {/* Breadcrumb */}
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate("/dashboard/monitors")}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Monitors
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-gray-900 dark:text-gray-100">
                {currentMonitor.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-6 border-b border-gray-200 dark:border-[#2e2f2f] pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {currentMonitor.name}
            </h1>
            <StatusBadge status={currentMonitor.status} />
          </div>
          <div
            onClick={() => window.open(currentMonitor.url, "_blank")}
            className="group flex items-center gap-1.5 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-[#5b63d3] dark:hover:text-[#5b63d3] transition-colors"
          >
            <span className="text-sm  truncate max-w-[280px] md:max-w-md">
              {currentMonitor.url}
            </span>
            <ExternalLink
              size={14}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            onClick={() =>
              changeStatus(
                currentMonitor.id,
                currentMonitor.status === "PAUSED" ? "UP" : "PAUSED",
              )
            }
            variant="outline"
            className="flex-1 md:flex-none border-gray-200 dark:border-[#2e2f2f] hover:bg-gray-50 dark:hover:bg-[#1e1e1e]"
          >
            {currentMonitor.status !== "PAUSED" ? (
              <div className="flex items-center gap-2">
                <Pause size={16} /> <span>Pause</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play size={16} /> <span>Resume</span>
              </div>
            )}
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="flex-1 md:flex-none bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:border-red-500/20 transition-colors shadow-none"
          >
            <Trash2 size={16} className="mr-2" /> <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <StatsCard
          icon={
            currentMonitor.status === "UP" ? (
              <TrendingUp className="text-emerald-500" size={24} />
            ) : currentMonitor.status === "DOWN" ? (
              <TrendingDown className="text-rose-500" size={24} />
            ) : (
              <Activity className="text-amber-500" size={24} />
            )
          }
          title={
            currentMonitor.status === "UP"
              ? "Up for"
              : currentMonitor.status === "DOWN"
                ? "Down for"
                : "Paused for"
          }
          details={formatDistanceToNow(currentMonitor.statusChangedAt, {
            addSuffix: false,
          })}
        />
        <StatsCard
          icon={<CircleCheck className="text-[#939db8]" size={24} />}
          title="Last checked"
          details={formatDistanceToNow(currentMonitor.lastChecked, {
            addSuffix: true,
          })}
        />
        <StatsCard
          icon={<Radio className="text-[#939db8]" size={24} />}
          title="Average Latency"
          details={`${Math.round(averageLatency)}ms`}
        />
      </div>

      {/* Graph & Heatmap */}
      <div className="flex flex-col gap-8 w-full">
        <LatencyGraph />

        <div className="flex flex-col w-full gap-4 p-6 rounded-xl border border-gray-200 dark:border-[#2e2f2f] bg-white dark:bg-[#121212] shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Uptime in last 30 days
          </h2>
          <StatusHeatmap />
        </div>
      </div>
    </div>
  );
}
