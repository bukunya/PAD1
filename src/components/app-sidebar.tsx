"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Calendar,
  User,
  GraduationCap,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Data untuk aplikasi SIPENDAR
const sispendarData = {
  teams: [
    {
      name: "raja singa",
      logo: GraduationCap,
      plan: "UGM System",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Form Pengajuan",
      url: "/form-pengajuan",
      icon: FileText,
    },
    {
      title: "Riwayat Pengajuan",
      url: "/riwayat-pengajuan",
      icon: Clock,
    },
    {
      title: "Detail Jadwal",
      url: "/detail-jadwal", 
      icon: Calendar,
    },
    {
      title: "Profil",
      url: "/profil",
      icon: User,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();

  // Don't render sidebar if not authenticated
  if (status === "loading") {
    return null;
  }

  if (!session) {
    return null;
  }

  const user = {
    name: session.user?.name || "User",
    email: session.user?.email || "",
    avatar: session.user?.image || "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sispendarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sispendarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
