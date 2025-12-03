export const dynamic = "force-dynamic";

import { getAllPengajuan } from "@/lib/actions/adminPengajuan/getPengajuan";
import PengajuanClient from "@/components/pengajuan/p-client";
import { redirect } from "next/navigation";

export default async function PengajuanPage() {
  const result = await getAllPengajuan();

  if (!result.success) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 p-6">
      <PengajuanClient initialData={result.data || []} />
    </div>
  );
}