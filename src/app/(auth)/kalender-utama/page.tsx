import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { detailJadwal } from "@/lib/actions/detailJadwal/detailJadwal";
import KalenderUtamaClient from "@/components/kalender-utama/ku-client";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";

export const metadata = {
  title: "SIMPENSI UGM: Kalender Utama",
  description: "Lihat kalender utama ujian tugas akhir",
};

export default async function KalenderUtamaPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = String(session.user.role || "").toUpperCase();

  const result = await detailJadwal();

  if (!result.success) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          {result.error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Kalender Utama"
        description="Lihat kalender utama ujian tugas akhir"
	action={
          role === "ADMIN" ? (
            <Link
              href="/daftar-penjadwalan"
              className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Lihat Daftar Penjadwalan
            </Link>
          ) : undefined
        }
      />
      <KalenderUtamaClient 
        initialData={result.data || []} 
        userRole={session.user.role || "MAHASISWA"}
      />
    </div>
  );
}