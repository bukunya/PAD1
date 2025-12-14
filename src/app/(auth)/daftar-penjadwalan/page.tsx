import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DJClient from "@/components/detail-jadwal/dj-client";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "SIMPENSI UGM: Daftar Penjadwalan",
  description: "Lihat semua informasi ujian tugas akhir mahasiswa",
};

export default async function DaftarPenjadwalanPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const role = String(session.user.role || "").toUpperCase();
  
  const allowedRoles = ["ADMIN"];
  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">Anda tidak memiliki akses ke halaman ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Daftar Penjadwalan"
        description="Lihat semua informasi ujian tugas akhir mahasiswa"
      />
      
      <DJClient role={role} />
    </div>
  );
}