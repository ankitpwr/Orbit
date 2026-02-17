import { BadgeAlert, BadgeCheck, Clock3 } from "lucide-react";
import type { User, UserMonitors } from "../lib/types";

export default function MonitorCard({
  url,
  name,
  id,
  status,
  createdAt,
}: UserMonitors) {
  return (
    <div className="w-full font-montserrat rounded-lg flex flex-col  justify-center  border border-[#dfe3ea]  cursor-pointer shadow-[1px_6px_10px_-4px_rgba(0,_0,_0,_0.1)]">
      <div className="bg-[#f8f9fc] rounded-t-lg py-2 ">
        <h1 className="px-4 text-lg ">{name}</h1>
      </div>
      <div className="h-[1px] w-full bg-[#dfe3ea] rounded-lg"></div>
      <div
        className="flex px-6 py-4 items-center justify-between text-base rounded-b-lg 
      "
      >
        <div className="flex items-center justify-center gap-2">
          {status == "UP" ? (
            <BadgeCheck color={"green"} size={18} className="" />
          ) : (
            <BadgeAlert color={"red"} size={18} />
          )}
          <h2>{url}</h2>
        </div>
        <h2>{status}</h2>
        <div className="flex items-center justify-center gap-2">
          <Clock3 size={18} />
          <span>10m</span>
        </div>
      </div>
    </div>
  );
}
