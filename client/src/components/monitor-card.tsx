import { AlarmClockCheck, Dot } from "lucide-react";
import type { UserMonitors } from "../lib/types";

export default function MonitorCard() {
  return (
    <div className="w-full bg-[#f8f9fc] font-montserrat rounded-lg flex flex-col py-4 justify-center gap-2 border border-[#dfe3ea]  cursor-pointer">
      <h1 className="px-4 text-xl ">Monitor name</h1>
      <div className="h-[1px] w-full bg-[#dfe3ea] rounded-lg"></div>
      <div className="flex px-4 items-center justify-between text-base">
        <div className="flex items-center justify-center">
          <Dot size={56} color={"green"} className="" />
          <h2>google.com</h2>
        </div>
        <h2>up</h2>
        <div className="flex items-center justify-center gap-2  ">
          <AlarmClockCheck size={20} />
          <span>10m</span>
        </div>
      </div>
    </div>
  );
}
