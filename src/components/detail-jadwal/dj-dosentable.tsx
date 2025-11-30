"use client";

import { useState } from "react";
import Image from "next/image";
import { format, addHours } from "date-fns";
import { id } from "date-fns/locale";
import { Eye } from "lucide-react";
import type { DosenDJ } from "@/lib/actions/detailJadwal/getDetailsUjianForAll";
import BAModal from "@/components/berita-acara/ba-modal";

interface DJDosenTableProps {
  data: DosenDJ[];
  loading: boolean;
}

export default function DJDosenTable({ data, loading }: DJDosenTableProps) {
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
    )}`;
  };

  const formatProdi = (prodi: string | null) => {
    if (!prodi) return "-";
    return prodi.replace(/([A-Z])/g, " $1").trim();
  };

  const getPeranLabel = (isPembimbing: boolean) => {
    return isPembimbing ? "Pembimbing" : "Penguji";
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
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
        <p className="text-gray-500">Tidak ada jadwal ujian ditemukan</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Table Header */}
        <div className="rounded-t-lg bg-blue-50 p-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
            <div className="col-span-2">Mahasiswa</div>
            <div className="col-span-3">Judul TA</div>
            <div className="col-span-2">Tanggal</div>
            <div className="col-span-2">Jam & Ruangan</div>
            <div className="col-span-2">Peran & Prodi</div>
            <div className="col-span-1 text-center">Aksi</div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {data.map((item) => (
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
                    <span className="font-medium text-gray-900">
                      {item.namaMahasiswa || "-"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.nim || "-"}
                    </span>
                  </div>
                </div>

                {/* Judul TA */}
                <div className="col-span-3 flex items-center">
                  <span className="text-sm text-gray-900 line-clamp-2">
                    {item.judulTugasAkhir || "-"}
                  </span>
                </div>

                {/* Tanggal */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-900">
                    {formatDate(item.tanggal)}
                  </span>
                </div>

                {/* Jam & Ruangan */}
                <div className="col-span-2 flex flex-col justify-center">
                  <span className="text-sm text-gray-900">
                    {formatTime(item.jamMulai, item.jamSelesai)}
                  </span>
                  <span className="text-xs text-gray-600">
                    {item.ruangan || "-"}
                  </span>
                </div>

                {/* Peran & Prodi */}
                <div className="col-span-2 flex flex-col justify-center">
                  <span
                    className={`text-sm font-medium ${
                      item.isDosenPembimbing
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {getPeranLabel(item.isDosenPembimbing)}
                  </span>
                  <span className="text-xs text-gray-600">
                    {formatProdi(item.prodi)} - {item.angkatan || "-"}
                  </span>
                </div>

                {/* Aksi */}
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedUjianId(item.id)}
                    className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                    title="Lihat Berita Acara"
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
          userRole="DOSEN"
          onClose={() => setSelectedUjianId(null)}
        />
      )}
    </>
  );
}
