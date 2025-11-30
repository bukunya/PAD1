// src/app/(auth)/pengajuan/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllPengajuan } from "@/lib/actions/adminPengajuan/getPengajuan";
import PengajuanTable from "@/components/pengajuan/p-table";

export default async function PengajuanPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">
            Hanya admin yang dapat mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  }

  const result = await getAllPengajuan();

  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manajemen Pengajuan</h1>
        <p className="text-muted-foreground">
          Kelola dan verifikasi pengajuan ujian mahasiswa.
        </p>
      </div>

      <PengajuanTable initialData={result.data || []} />
    </div>
  );
}