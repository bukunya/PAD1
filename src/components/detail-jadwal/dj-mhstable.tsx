"use client";

import { useState } from "react";
import { format, addHours } from "date-fns";
import { id } from "date-fns/locale";
import { Eye } from "lucide-react";
import type { MahasiswaDJ } from "@/lib/actions/detailJadwal/getDetailsUjianForAll";
import BAModal from "@/components/berita-acara/ba-modal";

interface DJMhsTableProps {
  data: MahasiswaDJ[];
  loading: boolean;
}

export default function DJMhsTable({ data, loading }: DJMhsTableProps) {
  const [selectedUjianId, setSelectedUjianId] = useState<string | null>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: id });
  };

  const formatTime = (start: Date | null, end: Date | null) => {
    if (!start || !end) return "-";
    return `${format(addHours(new Date(start), 7), "HH:mm")} - ${format(
      addHours(new Date(end), 7),
      "HH:mm"
    )} WIB`;
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="space-y-2">
                <div className="h-4 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-200" />
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
        <p className="text-gray-500">Tidak ada jadwal ujian Anda saat ini</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Table Header */}
        <div className="rounded-t-lg bg-blue-50 p-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
            <div className="col-span-1 text-center">No</div>
            <div className="col-span-3">Judul Tugas Akhir</div>
            <div className="col-span-2">Tanggal Ujian</div>
            <div className="col-span-2">Jam Ujian</div>
            <div className="col-span-3">Ruangan Ujian</div>
            <div className="col-span-1 text-center">Aksi</div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="grid grid-cols-12 gap-4">
                {/* No */}
                <div className="col-span-1 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-900">
                    {idx + 1}
                  </span>
                </div>

                {/* Judul TA */}
                <div className="col-span-3 flex items-center">
                  <span className="text-sm text-gray-900 line-clamp-2">
                    {item.judul || "-"}
                  </span>
                </div>

                {/* Tanggal */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-900">
                    {formatDate(item.tanggal)}
                  </span>
                </div>

                {/* Jam */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-900">
                    {formatTime(item.jamMulai, item.jamSelesai)}
                  </span>
                </div>

                {/* Ruangan */}
                <div className="col-span-3 flex items-center">
                  <span className="text-sm text-gray-900">
                    {item.ruangan || "-"}
                  </span>
                </div>

                {/* Aksi */}
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedUjianId(item.id)}
                    className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                    title="Lihat Detail"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Berita Acara */}
      {selectedUjianId && (
        <BAModal
          ujianId={selectedUjianId}
          userRole="MAHASISWA"
          onClose={() => setSelectedUjianId(null)}
        />
      )}
    </>
  );
}
