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
        <SidebarMenuButton className="hover:bg-gray-200/50 dark:hover:bg-[#1e1e1e] transition-colors h-12">
          <Avatar
            size="sm"
            className="border border-gray-200 dark:border-[#2e2f2f]"
          >
            <AvatarImage src={user?.picture} />
            <AvatarFallback className="bg-[#5b63d3] text-white font-medium">
              {user?.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-700 dark:text-gray-200 truncate">
            {user?.name || "User"}
          </span>
        </SidebarMenuButton>
      </PopoverTrigger>

      <PopoverContent
        className="p-2 rounded-xl w-64 font-montserrat border border-gray-200 dark:border-[#2e2f2f] bg-white dark:bg-[#121212] shadow-lg"
        align="start"
        sideOffset={12}
      >
        <div className="flex flex-col gap-1">
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-2 mb-1">
            <Avatar
              size="lg"
              className="border border-gray-200 dark:border-[#2e2f2f]"
            >
              <AvatarImage src={user?.picture} />
              <AvatarFallback className="bg-[#5b63d3] text-white text-lg font-medium">
                {user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.name || "User Name"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || "user@example.com"}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-[#2e2f2f] my-1"></div>

          {/* Actions */}
          <div
            className="flex items-center px-3 py-2.5 gap-3 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e1e1e] text-gray-700 dark:text-gray-200 transition-colors"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm font-medium">Toggle theme</span>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-[#2e2f2f] my-1"></div>

          <div
            onClick={handleLogout}
            className="flex items-center px-3 py-2.5 gap-3 cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
