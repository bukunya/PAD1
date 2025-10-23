"use client";

import DashboardTop from "@/components/dashboard/dash-top";
import DashboardBottom from "@/components/dashboard/dash-bottom";

export default function Page() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardTop />
        <DashboardBottom />
      </div>
    </>
  );
}
