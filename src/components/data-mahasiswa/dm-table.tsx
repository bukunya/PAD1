"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditMahasiswaModal } from "./dm-editmodal";
import { DeleteModal } from "../shared/dddm-deletemodal";
import { deleteUser } from "@/lib/actions/profile/deleteUser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MahasiswaData {
  id: string;
  name: string | null;
  nim: string | null;
  email: string | null;
  image: string | null;
  role: "MAHASISWA" | "DOSEN";
  prodi: string | null;
  telepon: string | null;
  dosenPembimbingId: string | null;
}

interface MahasiswaTableProps {
  mahasiswa: MahasiswaData[];
  dosenList: Array<{ id: string; name: string | null }>;
  currentPage: number;
}

export function MahasiswaTable({
  mahasiswa,
  dosenList,
  currentPage,
}: MahasiswaTableProps) {
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] =
    useState<MahasiswaData | null>(null);

  const handleEdit = (mhs: MahasiswaData) => {
    setSelectedMahasiswa(mhs);
    setEditModalOpen(true);
  };

  const handleDelete = (mhs: MahasiswaData) => {
    setSelectedMahasiswa(mhs);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMahasiswa) return;

    const result = await deleteUser(selectedMahasiswa.id);
    if (result.success) {
      toast.success("Data mahasiswa berhasil dihapus");
      router.refresh();
    } else {
      toast.error(result.error || "Gagal menghapus data");
    }
  };

  const getProdiLabel = (prodi: string | null) => {
    if (!prodi) return "-";
    const prodiMap: Record<string, string> = {
      TeknologiRekayasaPerangkatLunak: "Teknologi Rekayasa Perangkat Lunak",
      TeknologiRekayasaElektro: "Teknologi Rekayasa Elektro",
      TeknologiRekayasaInternet: "Teknologi Rekayasa Internet",
      TeknologiRekayasaInstrumentasiDanKontrol: "Teknologi Rekayasa Instrumentasi dan Kontrol",
    };
    return prodiMap[prodi] || prodi;
  };

  const getAngkatan = (nim: string | null) => {
    if (!nim || nim.length < 4) return "-";
    return "20" + nim.substring(0, 2);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Nama Mahasiswa
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Angkatan
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Program Studi
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mahasiswa.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data mahasiswa
                </td>
              </tr>
            ) : (
              mahasiswa.map((mhs) => (
                <tr
                  key={mhs.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage src={mhs.image || ""} alt={mhs.name || ""} />
                        <AvatarFallback className="rounded-full bg-blue-100 text-blue-600">
                          {mhs.name?.charAt(0).toUpperCase() || "M"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {mhs.name || "Nama tidak tersedia"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {mhs.nim || "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {getAngkatan(mhs.nim)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {getProdiLabel(mhs.prodi)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(mhs)}
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(mhs)}
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditMahasiswaModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        mahasiswa={selectedMahasiswa}
        dosenList={dosenList}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        userName={selectedMahasiswa?.name || ""}
        userType="mahasiswa"
      />
    </>
  );
}