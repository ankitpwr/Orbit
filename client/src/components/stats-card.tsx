import { CircleCheck } from "lucide-react";
import React, { type ReactElement } from "react";

interface props {
  icon: ReactElement;
  title: string;
  details: string;
}

export default function StatsCard({ icon, title, details }: props) {
  return (
    <div className="bg-[#f8f9fc] dark:bg-[#171717] border border-[#dfe3ea] dark:border-[#2e2f2f]  rounded-lg py-2 px-2 h-26 w-86 grid grid-cols-5 justify-center gap-2 cursor-pointer">
      <div className="flex justify-center items-center ">{icon}</div>
      <div className="col-span-4 flex flex-col justify-center gap-1">
        <h1 className="text-xl font-semibold">{title}</h1>
        <span className="text-sm  ">{details}</span>
      </div>
    </div>
  );
}
