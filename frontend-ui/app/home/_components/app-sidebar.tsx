"use client";

import { Home, FolderOpen, Clock, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import ActionButton from "./action-button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigationItems = [
  {
    title: "Home",
    icon: Home,
    url: "/home",
  },
  {
    title: "My Drive",
    icon: FolderOpen,
    url: "/home/drive",
  },
  {
    title: "Recent Files",
    icon: Clock,
    url: "/home/recent",
  },
  {
    title: "Documents",
    icon: FileText,
    url: "/home/documents",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-12 items-center justify-center rounded-lg text-primary-foreground">
            <Image src="/favicon.ico" alt="Logo" width={48} height={48} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Infinite Drive</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <ActionButton />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}