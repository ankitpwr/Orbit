import { Outlet } from "react-router-dom";
import AppSidebar from "../components/app-sidbar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";

export default function Dashboard() {
  return (
    <div className=" flex ">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger />

          <div className="flex-1 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
