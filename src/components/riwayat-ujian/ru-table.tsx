"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RiwayatUjianData {
  id: string;
  namaMahasiswa: string | null;
  nim: string | null;
  foto: string | null;
  judulTugasAkhir: string | null;
  tanggal: string | null;
  isDosenPembimbing: boolean;
  completed: boolean;
}

interface RiwayatUjianTableProps {
  data: RiwayatUjianData[];
}

export function RiwayatUjianTable({ data }: RiwayatUjianTableProps) {
  const formatTanggal = (tanggal: string | null) => {
    if (!tanggal) return "-";
    const date = new Date(tanggal);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getPeran = (isDosenPembimbing: boolean) => {
    return isDosenPembimbing ? "Pembimbing" : "Penguji";
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-[#EEF7FF]">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Nama Mahasiswa
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Judul Tugas Akhir
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Tanggal Ujian
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Peran
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                Belum ada riwayat ujian.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage
                        src={item.foto || ""}
                        alt={item.namaMahasiswa || ""}
                      />
                      <AvatarFallback className="rounded-full bg-blue-100 text-blue-600">
                        {item.namaMahasiswa?.charAt(0).toUpperCase() || "M"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.namaMahasiswa || "Nama tidak tersedia"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.nim || "-"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {item.judulTugasAkhir || "-"}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatTanggal(item.tanggal)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      item.isDosenPembimbing
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {getPeran(item.isDosenPembimbing)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Selesai
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}