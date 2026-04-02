import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { useTheme } from "./theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { SidebarMenuButton } from "./ui/sidebar";
import { LogOut, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
export default function ProfilePopup() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      toast.success(res.message, { position: "bottom-right" });
      navigate("/");
    } else {
      toast.error(res.message, { position: "bottom-right" });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SidebarMenuButton>
          <Avatar size="sm">
            <AvatarImage src={user?.picture} />
            <AvatarFallback>{user?.name[0]}</AvatarFallback>
          </Avatar>{" "}
          {user?.name}
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent
        className="px-0  rounded-2xl w-fit font-montserrat "
        align="start"
      >
        <div className="flex flex-col gap-3 ">
          <div className="flex items-center gap-2 px-3 ">
            <div className="">
              <Avatar size="lg">
                <AvatarImage src={user?.picture} />
                <AvatarFallback>{user?.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col text-[#737373]">
              <span className="text-sm dark:text-white">{user?.name}</span>
              <span className="text-xs dark:text-white">{user?.email}</span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#eaeaea] dark:bg-[#2e2f2f] rounded"></div>
          <div
            className="flex items-center px-4 gap-2 cursor-pointer"
            onClick={() => {
              theme == "light" ? setTheme("dark") : setTheme("light");
            }}
          >
            {theme == "light" ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm">Toggle theme</span>
          </div>

          <div className="w-full h-[1px] bg-[#eaeaea] dark:bg-[#2e2f2f] rounded"></div>

          <div
            onClick={() => {
              handleLogout();
            }}
            className="flex items-center px-4 gap-2 cursor-pointer"
          >
            <LogOut size={16} />
            <span className="text-sm">Logout</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
