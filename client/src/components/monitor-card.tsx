import { Clock3 } from "lucide-react";
import type { UserMonitors } from "../lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./status-badge";

export default function MonitorCard({ url, name, id, status }: UserMonitors) {
  const navigate = useNavigate();
  const handleMonitorSelection = () => {
    navigate(`/dashboard/monitors/${id}`);
  };
  return (
    <div
      onClick={() => handleMonitorSelection()}
      className="w-full font-montserrat rounded-lg flex flex-col  justify-center  border border-[#dfe3ea] dark:border-[#2e2f2f]  cursor-pointer shadow-[1px_6px_10px_-4px_rgba(0,_0,_0,_0.1)]"
    >
      <div className="bg-[#f8f9fc] dark:bg-[#161616] rounded-t-lg py-2 ">
        <h1 className="px-4 text-lg ">{name}</h1>
      </div>
      <div className="h-[1px] w-full bg-[#dfe3ea] dark:bg-[#2e2f2f] rounded-lg"></div>
      <div
        className="grid grid-cols-4 px-6 py-4  justify-center  text-base rounded-b-lg  
      "
      >
        <div className="col-span-2 flex items-center justify-start gap-2  ">
          <h2>{url}</h2>
        </div>
        <div className="">
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Clock3 size={18} /> <span>5m</span>
        </div>
      </div>
    </div>
  );
}
