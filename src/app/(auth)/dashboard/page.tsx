"use client";

import DashboardTop from "@/components/dashboard/dash-top";
import DashboardBottom from "@/components/dashboard/dash-bottom";
import { NavUser } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();
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
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardTop />
        <DashboardBottom />
      </div>
    </>
  );
}
