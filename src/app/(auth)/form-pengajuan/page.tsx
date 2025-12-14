import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import FpTop from "@/components/form-pengajuan/fp-top";
import FpBottom from "@/components/form-pengajuan/fp-bottom";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "SIMPENSI UGM: Form Pengajuan",
  description: "Ajukan permohonan ujian tugas akhir Anda",
};

export default async function FormPengajuanPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const allowedRoles = ["MAHASISWA"];
  if (!allowedRoles.includes(session.user.role || "")) {
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
        title="Form Pengajuan"
        description="Ajukan permohonan ujian tugas akhir Anda"
      />

      {/* Data Mahasiswa Section
      <FpTop /> */}

      {/* Upload Berkas Section */}
      <FpBottom />
    </div>
  );
}