import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  Globe,
  LogOut,
  Orbit,
  Settings,
  ShieldAlert,
  ToggleRight,
  User2,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./ui/popover";
import { Field } from "./ui/field";
import { ModeToggle } from "./mode-toggle";

export default function AppSidebar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
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
          <SidebarMenu>
            <SidebarMenuItem>
              <Popover>
                <PopoverTrigger>
                  <SidebarMenuButton>
                    <Avatar size="sm">
                      <AvatarImage src={user?.picture} />
                      <AvatarFallback>{user?.name[0]}</AvatarFallback>
                    </Avatar>{" "}
                    {user?.name}
                  </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent className="px-0 rounded-2xl" align="start">
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
                    <div className="w-full h-[1px] bg-[#eaeaea] rounded"></div>
                    <div className="flex flex-col justify-center px-2 ">
                      <ModeToggle />
                    </div>
                    <div className="w-full h-[1px] bg-[#eaeaea] rounded"></div>

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
