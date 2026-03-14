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
  User2,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

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
              <SidebarMenuButton>
                <Avatar size="sm">
                  <AvatarImage src={user?.picture} />
                  <AvatarFallback>{user?.name[0]}</AvatarFallback>
                </Avatar>{" "}
                {user?.name}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
