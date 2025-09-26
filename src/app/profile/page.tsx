"use client";

import Sidebar from "@/components/dashboard/sidebar"; // Sidebar manual
import Navbar from "@/components/dashboard/navbar";  // Navbar manual
import { Profile } from "@/components/profile/profile"; // Komponen profil

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar/>

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar
        <Navbar onToggleSidebar={() => {}} /> */}

        {/* Main content */}
        <main className="p-6 flex-1">
          <div className="bg-muted/50 flex-1 rounded-xl p-6">
            <Profile />
          </div>
        </main>
      </div>
    </div>
  );
}
