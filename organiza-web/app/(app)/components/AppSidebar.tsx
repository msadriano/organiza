"use client";

import Logo from "@/components/shared/Logo";
import SidebarNav from "./SidebarNav";
import SidebarUserProfile from "./SidebarUserProfile";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="flex flex-row items-center justify-between">
        {!isCollapsed && (
          <Logo type="complete" classIcon="h-8 w-8" className="text-2xl" />
        )}
        {!isCollapsed && <SidebarTrigger className="h-6 w-6" />}
        {isCollapsed && (
          <div className="w-full flex justify-center items-center">
            <SidebarTrigger className="h-6 w-6" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav  />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
