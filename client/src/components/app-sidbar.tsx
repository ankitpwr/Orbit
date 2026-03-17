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
import { Globe, Orbit, Settings, ShieldAlert } from "lucide-react";

import ProfilePopup from "./profile-popup";
import { useState } from "react";

export default function AppSidebar() {
  const navigate = useNavigate();

  const [sidebarMenu, setSidebarMenu] = useState("Monitors");

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
              <SidebarMenu
                onClick={() => {
                  setSidebarMenu("Monitors");
                  navigate("/dashboard/monitors");
                }}
              >
                <SidebarMenuItem
                  className={`${sidebarMenu == "Monitors" ? "bg-[#eeeff0] dark:bg-[#2e2f2f] rounded-lg " : ""}`}
                >
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
              <SidebarMenu
                onClick={() => {
                  setSidebarMenu("Incidents");
                  navigate("/dashboard/incidents");
                }}
              >
                <SidebarMenuItem
                  className={`${sidebarMenu == "Incidents" ? "bg-[#eeeff0] dark:bg-[#2e2f2f] rounded-lg " : ""}`}
                >
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
              <SidebarMenu
                onClick={() => {
                  setSidebarMenu("Settings");
                  navigate("/dashboard/settings");
                }}
              >
                <SidebarMenuItem
                  className={`${sidebarMenu == "Settings" ? "bg-[#eeeff0] dark:bg-[#2e2f2f] rounded-lg " : ""}`}
                >
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
              <ProfilePopup />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
