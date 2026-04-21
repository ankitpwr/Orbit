import { useLocation, useNavigate } from "react-router-dom";
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
import { useState } from "react";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  const [sidebarMenu, setSidebarMenu] = useState("Monitors");

  return (
    <div>
      <Sidebar
        collapsible="icon"
        className="font-montserrat border-r border-gray-200 dark:border-[#2e2f2f] bg-[#f8f9fc] dark:bg-[#121212]"
      >
        <SidebarHeader className="pt-4 pb-2 px-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-transparent cursor-default">
                <Orbit />
                <span className="font-montserrat text-3xl font-semibold">
                  Orbit
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="gap-6 mt-4">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem
                  onClick={() => {
                    navigate("/dashboard/monitors");
                  }}
                >
                  <SidebarMenuButton
                    className={`cursor-pointer rounded-lg ${
                      isActive("monitors")
                        ? "bg-[#5b63d3]/10 text-[#5b63d3] dark:bg-[#5b63d3]/20 dark:text-[#7c87f7] font-medium hover:bg-[#5b63d3]/10 hover:text-[#5b63d3] dark:hover:bg-[#5b63d3]/20 dark:hover:text-[#7c87f7]"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-[#1e1e1e] hover:text-gray-900 dark:hover:text-white"
                    }`}
                    tooltip={"Monitors"}
                  >
                    <Globe />
                    <span className="text-[16px]">Monitors</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem
                  onClick={() => {
                    setSidebarMenu("Incidents");
                    navigate("/dashboard/incidents");
                  }}
                >
                  <SidebarMenuButton
                    className={`cursor-pointer rounded-lg ${
                      isActive("incidents")
                        ? "bg-[#5b63d3]/10 text-[#5b63d3] dark:bg-[#5b63d3]/20 dark:text-[#7c87f7] font-medium hover:bg-[#5b63d3]/10 hover:text-[#5b63d3] dark:hover:bg-[#5b63d3]/20 dark:hover:text-[#7c87f7]"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-[#1e1e1e] hover:text-gray-900 dark:hover:text-white"
                    }`}
                    tooltip={"Incident"}
                  >
                    <ShieldAlert />
                    <span className="text-[16px]">Incidents</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem
                  onClick={() => {
                    setSidebarMenu("Settings");
                    navigate("/dashboard/settings");
                  }}
                >
                  <SidebarMenuButton
                    className={`cursor-pointer rounded-lg ${
                      isActive("settings")
                        ? "bg-[#5b63d3]/10 text-[#5b63d3] dark:bg-[#5b63d3]/20 dark:text-[#7c87f7] font-medium hover:bg-[#5b63d3]/10 hover:text-[#5b63d3] dark:hover:bg-[#5b63d3]/20 dark:hover:text-[#7c87f7]"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-[#1e1e1e] hover:text-gray-900 dark:hover:text-white"
                    }`}
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
              <ProfilePopup />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
