"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import type { AdminJadwalData } from "@/lib/actions/detailJadwal/adminJadwal";

interface DpTableProps {
  data: AdminJadwalData[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DpTable({ data, loading, currentPage, totalPages, onPageChange }: DpTableProps) {
  const router = useRouter();

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: id });
  };

  const formatTime = (start: Date | null, end: Date | null) => {
    if (!start || !end) return "-";
    return `${format(new Date(start), "HH:mm")} - ${format(new Date(end), "HH:mm")}`;
  };

  const formatProdi = (prodi: string | null) => {
    if (!prodi) return "-";
    return prodi.replace(/([A-Z])/g, " $1").trim();
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
              <div className="h-12 w-12 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow">
        <p className="text-gray-500">Tidak ada data penjadwalan ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="rounded-t-lg bg-blue-50 p-4">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
            <div className="col-span-2">Mahasiswa</div>
            <div className="col-span-2 text-center">Judul TA</div>  
            <div className="col-span-2">Dosen</div>
            <div className="col-span-2">Tanggal</div>
            <div className="col-span-2">Jam & Ruangan</div>
            <div className="col-span-1">Prodi & Angkatan</div>
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {data.map(item => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="grid grid-cols-12 gap-4">

              {/* Mahasiswa */}
              <div className="col-span-2 flex items-center gap-3">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                  {item.foto ? (
                    <Image
                      src={item.foto}
                      alt={item.namaMahasiswa || "Mahasiswa"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-gray-600">
                      {item.namaMahasiswa?.charAt(0) || "M"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{item.namaMahasiswa || "-"}</span>
                  <span className="text-sm text-gray-500">{item.nim || "-"}</span>
                </div>
              </div>

              {/* Judul TA */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-900 text-center w-full line-clamp-2">
                  {item.judulTugasAkhir || "-"}
                </span>
              </div>

              {/* Dosen */}
              <div className="col-span-2 flex flex-col justify-center">
                <span className="text-sm font-medium text-gray-900">
                  Dosen Pembimbing: {item.dosenPembimbing || "-"}
                </span>

                {item.dosenPenguji.length > 0 && (
                  <span className="mt-0.5 text-xs text-gray-600">
                    Penguji: {item.dosenPenguji.slice(0, 2).join(", ")}
                    {item.dosenPenguji.length > 2 && ` +${item.dosenPenguji.length - 2}`}
                  </span>
                )}
              </div>

              {/* Tanggal */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-900">{formatDate(item.tanggal)}</span>
              </div>

              {/* Jam & Ruangan */}
              <div className="col-span-2 flex flex-col justify-center">
                <span className="text-sm text-gray-900">
                  {formatTime(item.jamMulai, item.jamSelesai)}
                </span>
                <span className="text-xs text-gray-600">{item.ruangan || "-"}</span>
              </div>

              {/* Prodi */}
              <div className="col-span-1 flex flex-col justify-center">
                <span className="text-xs text-gray-600">
                  {item.prodi ? formatProdi(item.prodi) : "-"}
                </span>
                <span className="text-xs text-gray-500">
                  Angkatan {item.angkatan || "-"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ); // ← INI HARUS ADA, DAN SUDAH BENAR
}