"use client";

import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar/>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <Navbar onToggleSidebar={() => {}} />

        {/* Main content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
