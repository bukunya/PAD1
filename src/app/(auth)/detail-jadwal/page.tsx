import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DJClient from "@/components/detail-jadwal/dj-client";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "SIMPENSI UGM: Detail Jadwal",
  description: "Lihat detail jadwal ujian tugas akhir",
};

export default async function DetailJadwalPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const role = String(session.user.role || "").toUpperCase();
  
  // Redirect admin ke halaman daftar-penjadwalan
  if (role === "ADMIN") {
    redirect("/daftar-penjadwalan");
  }

  const allowedRoles = ["DOSEN", "MAHASISWA"];
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

  // Helper function untuk conditional description
  const getDescription = (userRole: string) => {
    return userRole === "MAHASISWA" 
      ? "Lihat jadwal ujian tugas akhir Anda" 
      : "Lihat jadwal ujian mahasiswa yang Anda bimbing/uji";
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Detail Jadwal"
        description={getDescription(role)}
      />
      
      <DJClient role={role} />
    </div>
  );
}