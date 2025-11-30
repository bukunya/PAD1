"use client";

import { useEffect, useState } from "react";
import { X, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getUjianDetailsForAll } from "@/lib/actions/detailJadwal/getDetailsUjianForAll";

interface BAModalProps {
  ujianId: string;
  userRole: "MAHASISWA" | "DOSEN";
  onClose: () => void;
}

interface UjianDetail {
  id: string;
  judul: string | null;
  berkasUrl: string | null;
  status: string;
  tanggalUjian: Date | null;
  jamMulai: Date | null;
  jamSelesai: Date | null;
  ruangan: {
    nama: string;
  } | null;
  mahasiswa: {
    name: string | null;
    nim: string | null;
    prodi: string | null;
  };
  dosenPembimbing: {
    name: string | null;
  } | null;
  dosenPenguji: Array<{
    dosen: {
      name: string | null;
    };
  }>;
}

export default function BAModal({ ujianId, userRole, onClose }: BAModalProps) {
  const [data, setData] = useState<UjianDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getUjianDetailsForAll(ujianId);

        if (result.success && result.data) {
          setData(result.data as UjianDetail);
        } else {
          setError(result.error || "Gagal mengambil data");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ujianId]);

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: id });
  };

  const formatTime = (start: Date | null, end: Date | null) => {
    if (!start || !end) return "-";
    return `${format(new Date(start), "HH:mm")} - ${format(
      new Date(end),
      "HH:mm"
    )} WIB`;
  };

  const formatProdi = (prodi: string | null) => {
    if (!prodi) return "-";
    return prodi.replace(/([A-Z])/g, " $1").trim();
  };

  const handleDownload = () => {
    if (data?.berkasUrl) {
      window.open(data.berkasUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-1/3 rounded bg-gray-200" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 rounded bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">Error</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 text-red-600">{error || "Data tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">
            {userRole === "MAHASISWA" ? "Detail Jadwal Ujian" : "Berita Acara"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mahasiswa Section - Only for DOSEN */}
          {userRole === "DOSEN" && (
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">
                Data Mahasiswa
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Mahasiswa</p>
                  <p className="font-medium text-gray-900">
                    {data.mahasiswa.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">NIM</p>
                  <p className="font-medium text-gray-900">
                    {data.mahasiswa.nim || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Judul TA */}
          <div>
            <p className="text-sm text-gray-600">Judul Tugas Akhir</p>
            <p className="mt-1 font-medium text-gray-900">
              {data.judul || "-"}
            </p>
          </div>

          {/* Jenis Ujian */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Jenis Ujian</p>
              <p className="mt-1 font-medium text-gray-900">Seminar Akhir</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Program Studi</p>
              <p className="mt-1 font-medium text-gray-900">
                {formatProdi(data.mahasiswa.prodi)}
              </p>
            </div>
          </div>

          {/* Jadwal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tanggal Ujian</p>
              <p className="mt-1 font-medium text-gray-900">
                {formatDate(data.tanggalUjian)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Waktu Ujian</p>
              <p className="mt-1 font-medium text-gray-900">
                {formatTime(data.jamMulai, data.jamSelesai)}
              </p>
            </div>
          </div>

          {/* Ruangan */}
          <div>
            <p className="text-sm text-gray-600">Ruang Ujian</p>
            <p className="mt-1 font-medium text-gray-900">
              {data.ruangan?.nama || "-"}
            </p>
          </div>

          {/* Dosen Section */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold text-gray-900">Tim Penguji</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Dosen Pembimbing 1</p>
                <p className="mt-1 font-medium text-gray-900">
                  {data.dosenPembimbing?.name || "-"}
                </p>
              </div>

              {data.dosenPenguji.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Dosen Penguji</p>
                  <div className="mt-1 space-y-1">
                    {data.dosenPenguji.map((penguji, idx) => (
                      <p key={idx} className="font-medium text-gray-900">
                        {idx + 1}. {penguji.dosen.name || "-"}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Berkas - Only for DOSEN */}
          {userRole === "DOSEN" && data.berkasUrl && (
            <div className="rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Dokumen Tugas Akhir
                    </p>
                    <p className="text-sm text-gray-600">File PDF tersedia</p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Catatan - Only for MAHASISWA */}
          {userRole === "MAHASISWA" && (
            <div className="rounded-lg bg-yellow-50 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Catatan dari Admin
              </p>
              <p className="text-sm text-gray-700">
                Silakan hadir 15 menit sebelum ujian dimulai dan membawa dokumen
                cetak.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
