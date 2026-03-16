import type { ping } from "./types";
export interface ReturnType {
  date: string;
  uptimepercent: number;
}
export function uptimePercentage(
  pingData: ping[],
  timezone: string,
): ReturnType[] {
  const statusUpMap: Map<string, number> = new Map();
  const daysWiseCount: Map<string, number> = new Map();

  pingData?.forEach((val, index) => {
    const date = new Date(val.timestamp);
    const normalize: string = date.toLocaleDateString("en-IN", {
      timeZone: timezone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (val.statusCode >= 200 && val.statusCode <= 300) {
      statusUpMap.set(normalize, (statusUpMap.get(normalize) || 0) + 1);
    }
    daysWiseCount.set(normalize, (daysWiseCount.get(normalize) || 0) + 1);
  });

  const array: ReturnType[] = [];
  for (const [key, totalCount] of daysWiseCount) {
    const upCount = statusUpMap.get(key) || 0;
    if (upCount != undefined && totalCount != undefined) {
      const data = {
        date: key,
        uptimepercent: (100 * upCount) / totalCount,
      };
      array.push(data);
    }
  }

  return array;
}
