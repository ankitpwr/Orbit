import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import useMonitorStore from "../store/useMonitorStore";
import MonitorCard from "../components/monitor-card";
import NoMonitor from "../components/no-monitor";
import { Skeleton } from "../components/ui/skeleton";

export default function Monitors() {
  const navigate = useNavigate();
  const { userMonitors, fetchUserMonitors, isLoadingMonitors } =
    useMonitorStore();

  useEffect(() => {
    fetchUserMonitors();
  }, [fetchUserMonitors]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col px-6 py-10 md:py-16 font-montserrat gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-[#2e2f2f] pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Monitors
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of your active endpoints and their current uptime status.
          </p>
        </div>
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate("/dashboard/monitors/new")}
          className="bg-[#5b63d3] text-white hover:bg-[#4a52c0] transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} />
          Create Monitor
        </Button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-4">
        {isLoadingMonitors ? (
          <div className="flex flex-col gap-10">
            <Skeleton className="w-full h-20 rounded-xl border border-gray-200 dark:border-[#2e2f2f] shadow-sm" />
            <Skeleton className="w-full h-20 rounded-xl border border-gray-200 dark:border-[#2e2f2f] shadow-sm" />
            <Skeleton className="w-full h-20 rounded-xl border border-gray-200 dark:border-[#2e2f2f] shadow-sm" />
          </div>
        ) : userMonitors.length !== 0 ? (
          <div className="flex flex-col gap-12">
            {userMonitors.map((data) => (
              <MonitorCard
                key={data.id}
                id={data.id}
                name={data.name}
                url={data.url}
                status={data.status}
                interval={data.interval}
              />
            ))}
          </div>
        ) : (
          <NoMonitor />
        )}
      </div>
    </div>
  );
}
