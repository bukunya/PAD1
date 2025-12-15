import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { dashboardTop } from "@/lib/actions/dashboard/dashboardTop";
import { dashBottom } from "@/lib/actions/dashboard/dashBottom";
import { getNotifications } from "@/lib/actions/notifikasi/notifications";
import { dashboardAdmin } from "@/lib/actions/dashboard/adminDash";
import { verifyUserRole } from "@/lib/actions/auth/verifyRole";
import { PageHeader } from "@/components/page-header";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const validRole = await verifyUserRole(
    String(session?.user?.id || ""),
    String(session?.user?.role || "")
  );

  if (!validRole.valid) {
    redirect("/api/logout");
  }

  const userRole = String(session.user.role || "").toUpperCase();

  let pengajuanData = null;
  if (userRole === "ADMIN") {
    pengajuanData = await dashboardAdmin();
  }

  // Fetch dashboard data
  const [topResult, bottomResult, notifResult] = await Promise.all([
    dashboardTop(),
    dashBottom(),
    userRole !== "ADMIN" ? getNotifications() : Promise.resolve(null),
  ]);

  const topData = topResult.success
    ? topResult
    : { data: [], error: topResult.error };

  const bottomData = bottomResult.success
    ? bottomResult
    : { data: [], error: bottomResult.error };

  // **LIMIT NOTIFIKASI 7 ITEM**
  const notifications =
    notifResult?.success && Array.isArray(notifResult.data)
      ? {
          ...notifResult,
          data: notifResult.data.slice(0, 7),
        }
      : { data: [] };

  // Get first name
  const userName = session.user?.name || "User";

  // Simple role-based content
  const getPageContent = () => {
    switch (userRole) {
      case "MAHASISWA":
        return {
          title: `Selamat datang, ${userName}!`,
          description: "Pantau status pengajuan dan jadwal sidang tugas akhir Anda",
        };
      
      case "DOSEN":
        return {
          title: `Selamat datang, ${userName}!`,
          description: "Kelola jadwal bimbingan dan ujian mahasiswa Anda",
        };
      
      case "ADMIN":
        return {
          title: `Selamat datang, ${userName}!`,
          description: "Kelola pengajuan dan penjadwalan sidang secara menyeluruh",
        };
      
      default:
        return {
          title: "Dashboard",
          description: "Selamat datang di SIMPENSI",
        };
    }
  };

  const pageContent = getPageContent();

  return (
    <div className="space y-6 p-6">
      <PageHeader 
        title={pageContent.title}
        description={pageContent.description} />

    <DashboardClient
      role={userRole}
      topData={topData}
      bottomData={bottomData}
      notifications={notifications}
      pengajuanData={pengajuanData}
    />
    </div>
  );
}
