import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import StatusCard from "@/components/dashboard/statusCard";
import StatusTimeline from "@/components/dashboard/statusTimeline";
import CalendarWidget from "@/components/dashboard/calendar";
import JadwalTable from "@/components/dashboard/jadwalTabel";

// Loading component untuk Suspense
function DashboardLoading() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Server Component
async function DashboardContent() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  // Fetch data dari backend API
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const res = await fetch(new URL("/api/dashboard", baseUrl), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data dashboard");
  }

  const { statusPengajuan, jadwalUjian, agenda } = await res.json();

  // derive status terakhir
  const latest = statusPengajuan?.[0];
  const statusUjian = latest ? latest.status : "Belum ada pengajuan";
  const ruangUjian = latest?.ruangUjian || "Belum ada ruangan";

  return (
    <main className="p-6 space-y-8">
  {/* Grid utama */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
    {/* Kalender */}
    <div className="lg:row-span-2">
      <CalendarWidget agenda={agenda} />
    </div>

    {/* Status & Ruangan */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-2 gap-6">
      <StatusCard
        title="Status Pengajuan Ujian"
        value={statusUjian}
        type="status"
        index={0}
      />
      <StatusCard
        title="Tempat Ruang Ujian"
        value={ruangUjian}
        type="ruangan"
        index={1}
      />
    </div>

    {/* Timeline */}
    <div className="lg:col-span-2">
      <StatusTimeline statusList={statusPengajuan} />
    </div>
  </div>

  {/* Jadwal Tabel */}
  <JadwalTable jadwalList={jadwalUjian} />
</main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
