// app/(auth)/riwayat-pengajuan/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getNotifications } from "@/lib/actions/notifikasi/notifications";
import RiwayatPengajuanClient from "@/components/riwayat-pengajuan/rp-client";

export default async function RiwayatPengajuanPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Allow MAHASISWA, DOSEN, and ADMIN
  if (!["MAHASISWA", "DOSEN", "ADMIN"].includes(session.user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">
            Anda tidak memiliki akses ke halaman ini.
          </p>
        </div>
      </div>
    );
  }

  // Fetch notifications data
  const result = await getNotifications(1, 50);

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

  // Dynamic title based on role
  const pageTitle =
    session.user.role === "MAHASISWA"
      ? "Riwayat Pengajuan"
      : session.user.role === "DOSEN"
      ? "Notifikasi Ujian"
      : "Notifikasi Admin";

  const pageDescription =
    session.user.role === "MAHASISWA"
      ? "Timeline notifikasi dan status pengajuan ujian Anda."
      : session.user.role === "DOSEN"
      ? "Timeline notifikasi ujian mahasiswa bimbingan dan penguji."
      : "Timeline notifikasi pengajuan yang perlu ditindaklanjuti.";

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
        <p className="text-muted-foreground">{pageDescription}</p>
      </div>

      {/* Timeline Content */}
      <RiwayatPengajuanClient
        initialData={result.data || []}
        pagination={result.pagination}
        userRole={session.user.role}
      />
    </div>
  );
}