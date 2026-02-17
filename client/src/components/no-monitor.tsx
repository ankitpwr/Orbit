import { Empty } from "../assets/svg";

export default function NoMonitor() {
  return (
    <div className="flex flex-col items-center justify-center pt-20 bg-[#f8f9fc] h-full rounded-xl border border-[#dfe3ea]">
      <h1 className="text-4xl">No Monitors</h1>
      <Empty />
    </div>
  );
}
