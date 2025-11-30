"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditDosenModal } from "./dd-editmodal";
import { DeleteModal } from "../shared/dddm-deletemodal";
import { deleteUser } from "@/lib/actions/profile/deleteUser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DosenData {
  id: string;
  name: string | null;
  nim: string | null;
  email: string | null;
  image: string | null;
  departemen: string | null;
  telepon: string | null;
  prodi: string | null;
}

interface DosenTableProps {
  dosen: DosenData[];
  currentPage: number;
}

export function DosenTable({ dosen, currentPage }: DosenTableProps) {
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState<DosenData | null>(null);

  const handleEdit = (dsn: DosenData) => {
    setSelectedDosen(dsn);
    setEditModalOpen(true);
  };

  const handleDelete = (dsn: DosenData) => {
    setSelectedDosen(dsn);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDosen) return;

    const result = await deleteUser(selectedDosen.id);
    if (result.success) {
      toast.success("Data dosen berhasil dihapus");
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

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Nama Dosen
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Program Studi
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dosen.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data dosen
                </td>
              </tr>
            ) : (
              dosen.map((dsn) => (
                <tr
                  key={dsn.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage src={dsn.image || ""} alt={dsn.name || ""} />
                        <AvatarFallback className="rounded-full bg-green-100 text-green-600">
                          {dsn.name?.charAt(0).toUpperCase() || "D"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {dsn.name || "Nama tidak tersedia"}
                        </p>
                        <p className="text-sm text-gray-500">
                          NIP: {dsn.nim || "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {getProdiLabel(dsn.prodi)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {dsn.email || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(dsn)}
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(dsn)}
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

      <EditDosenModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        dosen={selectedDosen}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        userName={selectedDosen?.name || ""}
        userType="dosen"
      />
    </>
  );
}