import type React from "react";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getCurrentUser } from "../actions/auth.action";
import { AppSidebar } from "./_components/app-sidebar";
import { AppHeader } from "./_components/app-header";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import RightClickContext from "./_components/right-click-context";
import { UploadPopup } from "./_components/upload-popup";
import NewFolder from "./_components/new-folder";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader user={user} />
        <ContextMenu>
          <ContextMenuTrigger className="flex-1 p-4">
            {children}
          </ContextMenuTrigger>
          <RightClickContext />
        </ContextMenu>
      </SidebarInset>
      <UploadPopup />
      <NewFolder />
    </SidebarProvider>
  );
}
