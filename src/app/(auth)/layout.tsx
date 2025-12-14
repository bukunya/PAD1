"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Mobile trigger button - hanya tampil di mobile */}
        <div className="md:hidden sticky top-0 z-10 bg-background border-b">
          <div className="flex items-center gap-2 px-4 py-3">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">SIMPENSI</h1>
          </div>
        </div>
        
        {/* Main content - tanpa navbar */}
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}