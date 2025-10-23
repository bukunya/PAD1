"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import {
  FileText,
  LayoutDashboard,
  FileClock,
  Calendar,
  User,
  Bell,
  SquareUser,
  ClipboardList,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const dashboard = {
  name: "Dashboard",
  url: "/dashboard",
  icon: LayoutDashboard,
};

const profile = {
  name: "Profil",
  url: "/profil",
  icon: User,
};

const dataMhs = {
  projects: [
    dashboard,
    {
      name: "Form Pengajuan",
      url: "/form-pengajuan",
      icon: FileText,
    },
    {
      name: "Riwayat Pengajuan",
      url: "/riwayat-pengajuan",
      icon: FileClock,
    },
    {
      name: "Detail Jadwal",
      url: "/detail-jadwal",
      icon: Calendar,
    },
    profile,
  ],
};
const dataDosn = {
  projects: [
    dashboard,
    {
      name: "Detail Jadwal",
      url: "/detail-jadwal",
      icon: Calendar,
    },
    {
      name: "Riwayat Ujian",
      url: "/riwayat-ujian",
      icon: FileClock,
    },
    {
      name: "Notifikasi",
      url: "/notifikasi",
      icon: Bell,
    },
    profile,
  ],
};
const dataAdm = {
  projects: [
    dashboard,
    {
      name: "Pengajuan",
      url: "/pengajuan",
      icon: FileText,
    },
    {
      name: "Formulir Penjadwalan",
      url: "/formulir-penjadwalan",
      icon: FileClock,
    },
    {
      name: "Kalender Utama",
      url: "/kalender-utama",
      icon: Calendar,
    },
    {
      name: "Data Mahasiswa",
      url: "/data-mahasiswa",
      icon: SquareUser,
    },
    {
      name: "Data Dosen",
      url: "/data-dosen",
      icon: SquareUser,
    },
    {
      name: "Riwayat dan Laporan",
      url: "/riwayat-dan-laporan",
      icon: ClipboardList,
    },
    profile,
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();

  if (status === "loading" || !session) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <div className="p-8" />
        <SidebarContent>
          <div className="p-4 space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse"></div>
            <div className="h-8 bg-muted rounded animate-pulse"></div>
            <div className="h-8 bg-muted rounded animate-pulse"></div>
          </div>
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  const role = session.user?.role;
  let dataNav;
  if (role === "MAHASISWA") {
    dataNav = dataMhs;
  } else if (role === "DOSEN") {
    dataNav = dataDosn;
  } else if (role === "ADMIN") {
    dataNav = dataAdm;
  } else {
    dataNav = dataMhs; // default to mahasiswa if role is undefined
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <div className="p-8" />

      <SidebarContent>
        <NavProjects projects={dataNav.projects} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
