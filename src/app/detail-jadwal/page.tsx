import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DetailJadwalTable from "@/components/detail-jadwal/detailJadwalTable";

// Loading component untuk Suspense
function DetailJadwalLoading() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        
        {/* Table skeleton */}
        <div className="space-y-3">
          <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Server Component
async function DetailJadwalContent() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  // Fetch data dari backend API
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  try {
    const res = await fetch(new URL("/api/dashboard", baseUrl), {
      cache: "no-store",
      headers: {
        'user-id': session.user.id,
        'user-role': session.user.role
      }
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil data jadwal");
    }

    const { jadwalList } = await res.json();

    return (
      <main className="p-6">
        <DetailJadwalTable jadwalList={Array.isArray(jadwalList) ? jadwalList : []} />
      </main>
    );

  } catch (error) {
    console.error("Error fetching jadwal:", error);
    
    return (
      <main className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gagal Memuat Data
          </h3>
          <p className="text-gray-600 mb-4">
            Terjadi kesalahan saat mengambil data jadwal. Silakan coba lagi.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </main>
    );
  }
}

export default function DetailJadwalPage() {
  return (
    <Suspense fallback={<DetailJadwalLoading />}>
      <DetailJadwalContent />
    </Suspense>
  );
}