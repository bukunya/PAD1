import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { riwayatUjian } from "@/lib/actions/riwayatUjian/riwayatUjian";
import { RiwayatUjianClient } from "@/components/riwayat-ujian/ru-client";

interface PageProps {
  searchParams: {
    page?: string;
  };
}

interface DosenRU {
  id: string;
  namaMahasiswa: string | null;
  nim: string | null;
  foto: string | null;
  judulTugasAkhir: string | null;
  tanggal: string | null;
  isDosenPembimbing: boolean;
  completed: boolean;
}

export default async function RiwayatUjianPage({ searchParams }: PageProps) {
  const session = await auth();

  // Check authentication
  if (!session?.user) {
    redirect("/login");
  }

  // Check role authorization
  if (session.user.role !== "DOSEN") {
    redirect("/dashboard");
  }

  const page = Number(searchParams.page) || 1;

  // Fetch riwayat ujian data
  const result = await riwayatUjian({
    page,
    limit: 10,
  });

  if (!result.success || !result.data || !result.pagination) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Ujian</h1>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">{result.error || "Gagal memuat data"}</p>
        </div>
      </div>
    );
  }

  // Type guard to ensure we have DosenRU data
  const isDosenData = (item: unknown): item is DosenRU => {
    return (
      typeof item === "object" &&
      item !== null &&
      "isDosenPembimbing" in item &&
      "completed" in item
    );
  };

  // Filter only completed exams and ensure correct type
  const completedData = result.data
    .filter(isDosenData)
    .filter((item) => item.completed);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Ujian</h1>
      </div>

      <RiwayatUjianClient
        data={completedData}
        pagination={{
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: completedData.length,
          totalPages: Math.ceil(completedData.length / result.pagination.limit),
          hasMore: result.pagination.hasMore,
        }}
      />
    </div>
  );
}
