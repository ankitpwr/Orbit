import { type ReactElement } from "react";

interface Props {
  icon: ReactElement;
  title: string;
  details: string;
}

export default function StatsCard({ icon, title, details }: Props) {
  return (
    <div className="flex items-center gap-4 p-5 w-full rounded-xl border border-gray-200 dark:border-[#2e2f2f] bg-white dark:bg-[#121212] shadow-sm">
      <div className="flex justify-center items-center p-3 rounded-lg bg-gray-50 dark:bg-[#1e1e1e]">
        {icon}
      </div>

      <div className="flex flex-col justify-center overflow-hidden">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
          {title}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
          {details}
        </h2>
      </div>
    </div>
  );
}
