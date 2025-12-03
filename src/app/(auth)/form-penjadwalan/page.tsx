export const dynamic = "force-dynamic";

import { getAllPengajuan } from "@/lib/actions/adminPengajuan/getPengajuan";
import PenjadwalanClient from "@/components/form-penjadwalan/fp-client";
import { redirect } from "next/navigation";

export default async function PenjadwalanPage() {
  // Hanya ambil pengajuan dengan status DITERIMA yang siap dijadwalkan
  const result = await getAllPengajuan({ status: "DITERIMA" });

  if (!result.success) {
    redirect("/login");
  }

  return (
    <div className="space y-6 p-6">
      <PenjadwalanClient initialData={result.data || []} />
    </div>
  );
}