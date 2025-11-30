// src/app/(auth)/form-penjadwalan/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllPengajuan } from "@/lib/actions/adminPengajuan/getPengajuan";
import PenjadwalanTable from "@/components/form-penjadwalan/fp-table";

export default async function FormPenjadwalanPage() {
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

  // Fetch only DITERIMA status (approved but not scheduled yet)
  const result = await getAllPengajuan({ status: "DITERIMA" });

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
        <h1 className="text-3xl font-bold mb-2">Formulir Penjadwalan</h1>
        <p className="text-muted-foreground">
          Jadwalkan ujian untuk pengajuan yang sudah diverifikasi.
        </p>
      </div>

      <PenjadwalanTable initialData={result.data || []} />
    </div>
  );
}