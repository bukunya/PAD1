"use client";

import { TopSection } from "./dash-top";
import { BottomSection } from "./dash-bottom";
import { Calendar } from "./dash-calendar";
import dynamic from "next/dynamic";
import { PengajuanSection } from "./dash-pengajuan";

const StatusNotification = dynamic(
  () => import("./dash-notif").then((mod) => mod.StatusNotification),
  { ssr: false }
);

interface DashboardClientProps {
  role: string;
  topData: Record<string, unknown> | null;
  bottomData: Record<string, unknown> | null;
  notifications: Record<string, unknown> | null;
  pengajuanData: Record<string, unknown> | null;
}

export default function DashboardClient({
  role,
  topData,
  bottomData,
  notifications,
  pengajuanData,
}: DashboardClientProps) {
  const userRole = role?.toUpperCase();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Main Grid: Left (Stats + Notif/Pengajuan) | Right (Calendar) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* LEFT COLUMN - Match height with right column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Stats */}
          <TopSection role={userRole} topData={topData as never} />

          {/* Admin: Pengajuan Section with fixed height and scroll */}
          {userRole === "ADMIN" && pengajuanData && (
            <div className="h-[610px]">
              <PengajuanSection pengajuanData={pengajuanData as never} />
            </div>
          )}

          {/* Non-Admin: Notification with fixed height and scroll */}
          {userRole !== "ADMIN" && notifications && (
            <div className="h-[625px]">
              <StatusNotification notifications={notifications as never} />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Calendar (reference height ~600px) */}
        <div className="lg:col-span-2">
          <Calendar
            upcomingExams={(topData as { data?: never[] })?.data || []}
            role={userRole}
          />
        </div>
      </div>

      {/* Bottom Full-Width Section */}
      <BottomSection role={userRole} bottomData={bottomData as never} />
    </div>
  );
}
