import { useNavigate, useLocation } from "react-router-dom";
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
import { Globe, Orbit, Settings, ShieldAlert } from "lucide-react";
import ProfilePopup from "./profile-popup";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check if a route is currently active based on the URL
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <Sidebar
      collapsible="icon"
      className="font-montserrat border-r border-gray-200 dark:border-[#2e2f2f] bg-[#f8f9fc] dark:bg-[#121212]"
    >
      <SidebarHeader className="pt-4 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-transparent cursor-default">
              <Orbit className="" size={28} />
              <span className="font-montserrat text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Orbit
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 ">
        <SidebarGroup className=" gap-1.5 mt-4">
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/dashboard/monitors")}
                  tooltip="Monitors"
                  className={`cursor-pointer py-5  transition-colors ${
                    isActive("monitors")
                      ? "bg-[#5b63d3]/10 text-[#5b63d3] dark:bg-[#5b63d3]/20 dark:text-[#7c87f7] font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-[#1e1e1e] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Globe size={20} />
                  <span className="text-[16px]">Monitors</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/dashboard/incidents")}
                  tooltip="Incidents"
                  className={`cursor-pointer py-5 transition-colors ${
                    isActive("incidents")
                      ? "bg-[#5b63d3]/10 text-[#5b63d3] dark:bg-[#5b63d3]/20 dark:text-[#7c87f7] font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-[#1e1e1e] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <ShieldAlert size={20} />
                  <span className="text-[16px]">Incidents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/dashboard/settings")}
                  tooltip="Settings"
                  className={`cursor-pointer py-5 transition-colors ${
                    isActive("settings")
                      ? "bg-[#5b63d3]/10 text-[#5b63d3] dark:bg-[#5b63d3]/20 dark:text-[#7c87f7] font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-[#1e1e1e] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Settings size={20} />
                  <span className="text-[16px]">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-4 px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <ProfilePopup />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
