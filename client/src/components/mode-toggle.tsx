import { LaptopMinimal, Moon, Sun } from "lucide-react";

import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  function checkActive(th: string) {
    return th == theme;
  }

  return (
    <div className="  flex p-1  gap-1 items-center border border-[#f1f0ff] dark:border-[#2a2a34] w-fit rounded-xl">
      <Button
        variant={"secondary"}
        size={"sm"}
        onClick={() => setTheme("light")}
      >
        {" "}
        <Sun size={16} color={"currentColor"} />
      </Button>
      <Button
        variant={"secondary"}
        size={"sm"}
        onClick={() => setTheme("dark")}
      >
        {" "}
        <Moon size={16} color={"currentColor"} />
      </Button>
      <Button
        variant={"secondary"}
        size={"sm"}
        onClick={() => {
          setTheme("system");
        }}
      >
        {" "}
        <LaptopMinimal size={16} color={"currentColor"} />
      </Button>
    </div>
  );
}
