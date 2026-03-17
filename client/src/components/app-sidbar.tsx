import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  Globe,
  LogOut,
  Moon,
  Orbit,
  Settings,
  ShieldAlert,
  Sun,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useTheme } from "./theme-provider";

export default function AppSidebar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();

  console.log("theme is :::", theme);

  return (
    <div>
      <Sidebar collapsible="icon" className="font-montserrat">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Orbit />
                <span className="font-montserrat text-3xl font-semibold">
                  Orbit
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/*group-1 */}

          <SidebarGroup className="gap-3">
            <SidebarGroupContent>
              <SidebarMenu onClick={() => navigate("/dashboard/monitors")}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    tooltip={"Monitors"}
                  >
                    <Globe />
                    <span className="text-[16px]">Monitors</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupContent>
              <SidebarMenu onClick={() => navigate("/dashboard/incidents")}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    tooltip={"Incident"}
                  >
                    <ShieldAlert />
                    <span className="text-[16px]">Incidents</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupContent>
              <SidebarMenu onClick={() => navigate("/dashboard/settings")}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    tooltip={"Incident"}
                  >
                    <Settings />
                    <span className="text-[16px]">Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="flex flex-col gap-2  py-4 ">
            <SidebarMenuItem></SidebarMenuItem>
            <SidebarMenuItem>
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
                  className="px-0  rounded-2xl w-fit "
                  align="center"
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
                        <span className="text-sm">{user?.name}</span>
                        <span className="text-xs">{user?.email}</span>
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-[#eaeaea] dark:bg-[#2e2f2f] rounded"></div>
                    <div
                      className="flex items-center px-4 gap-2 cursor-pointer"
                      onClick={() => {
                        theme == "light" ? setTheme("dark") : setTheme("light");
                      }}
                    >
                      {theme == "light" ? (
                        <Sun size={16} />
                      ) : (
                        <Moon size={16} />
                      )}
                      <span className="text-sm">Toggle theme</span>
                    </div>

                    <div className="w-full h-[1px] bg-[#eaeaea] dark:bg-[#2e2f2f] rounded"></div>

                    <div className="flex items-center px-4 gap-2">
                      <LogOut size={16} />
                      <span className="text-sm">Logout</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
