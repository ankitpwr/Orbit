import { CircleSlash } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

export default function NoMonitor() {
  return (
    <div className="flex h-80 bg-transparent items-center justify-center flex-col  pt-20   rounded-xl">
      <div className="">
        <Empty className="border-none shadow-none bg-transparent">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="bg-gray-100 dark:bg-[#1e1e1e] text-gray-500"
            >
              <CircleSlash />
            </EmptyMedia>
            <EmptyTitle className="text-gray-900 dark:text-white">
              No Data
            </EmptyTitle>
            <EmptyDescription className="text-gray-500 dark:text-gray-400">
              It looks like there's nothing here yet!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>
  );
}
