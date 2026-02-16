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
import { Globe, Orbit } from "lucide-react";

export default function AppSidebar() {
  const navigate = useNavigate();
  return (
    <div>
      <Sidebar collapsible="icon" className="font-montserrat">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Orbit size={32} />
                <span className="font-montserrat text-2xl font-semibold">
                  Orbit
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/*group-1 */}

          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu onClick={() => navigate("/dashboard/monitors")}>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={"Monitors"}>
                    <Globe />
                    <span>Monitors</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/*group-2 */}
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </div>
  );
}
