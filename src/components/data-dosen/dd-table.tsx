"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { EditDosenModal } from "./dd-editmodal";
import { DeleteModal } from "../shared/dddm-deletemodal";
import { hapusDataDsn, cekDsnData } from "@/lib/actions/statistikDataMhsDsn/hapusDataMhsDsn";
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

interface ActiveSchedule {
  tanggalUjian: Date | null; // Allow null
  jamMulai: Date | null;     // Allow null
  jamSelesai: Date | null;   // Allow null
  ruangan?: {
    nama: string;
  } | null;                  // Allow null
  mahasiswa: {
    name: string | null;     // Align with your error message
    nim: string | null;      // Align with your error message
  };
  judul: string;
}

const ITEMS_PER_PAGE = 10;

export function DosenTable({ dosen }: DosenTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState<DosenData | null>(null);
  const [activeSchedules, setActiveSchedules] = useState<ActiveSchedule[]>([]);
  const [isCheckingSchedules, setIsCheckingSchedules] = useState(false);

  const totalPages = Math.ceil(dosen.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDosen = dosen.slice(startIndex, endIndex);

  const handleEdit = (dsn: DosenData) => {
    setSelectedDosen(dsn);
    setEditModalOpen(true);
  };

  // ✅ Check for active schedules before showing delete modal
  const handleDelete = async (dsn: DosenData) => {
    setSelectedDosen(dsn);
    setIsCheckingSchedules(true);

    try {
      const result = await cekDsnData(dsn.id);

      if (result.success && result.data) {
        // Combine pembimbing and penguji schedules
        const allSchedules: ActiveSchedule[] = [
          ...result.data.dosenPembimbing.map((ujian) => ({
            tanggalUjian: ujian.tanggalUjian,
            jamMulai: ujian.jamMulai,
            jamSelesai: ujian.jamSelesai,
            ruangan: ujian.ruangan,
            mahasiswa: ujian.mahasiswa,
            judul: ujian.judul,
          })),
          ...result.data.dosenPenguji.map((item) => ({
            tanggalUjian: item.ujian.tanggalUjian,
            jamMulai: item.ujian.jamMulai,
            jamSelesai: item.ujian.jamSelesai,
            ruangan: item.ujian.ruangan,
            mahasiswa: item.ujian.mahasiswa,
            judul: item.ujian.judul,
          })),
        ];

        setActiveSchedules(allSchedules);
      }
    } catch (error) {
      console.error("Error checking schedules:", error);
      toast.error("Gagal memeriksa jadwal dosen");
    } finally {
      setIsCheckingSchedules(false);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedDosen) return;

    const result = await hapusDataDsn(selectedDosen.id);
    
    if (result.success) {
      toast.success("Data dosen berhasil dihapus");
      router.refresh();
      setDeleteModalOpen(false);
    } else {
      toast.error("Gagal menghapus data dosen");
      console.error("Error deleting dosen:", result.error);
    }
  };

  const getProdiLabel = (prodi: string | null) => {
    if (!prodi) return "-";
    const prodiMap: Record<string, string> = {
      TeknologiRekayasaPerangkatLunak: "Teknologi Rekayasa Perangkat Lunak",
      TeknologiRekayasaElektro: "Teknologi Rekayasa Elektro",
      TeknologiRekayasaInternet: "Teknologi Rekayasa Internet",
      TeknologiRekayasaInstrumentasiDanKontrol:
        "Teknologi Rekayasa Instrumentasi dan Kontrol",
    };
    return prodiMap[prodi] || prodi;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-blue-50">
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
              {paginatedDosen.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada data dosen
                  </td>
                </tr>
              ) : (
                paginatedDosen.map((dsn) => (
                  <tr
                    key={dsn.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-full">
                          <AvatarImage
                            src={dsn.image || ""}
                            alt={dsn.name || ""}
                          />
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
                          disabled={isCheckingSchedules}
                          className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              disabled={currentPage === 1}
              className="h-9 w-9 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-gray-600"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(page as number)}
                  className={`h-9 w-9 ${
                    currentPage === page
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className="h-9 w-9 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <EditDosenModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        dosen={selectedDosen}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setActiveSchedules([]);
        }}
        onConfirm={confirmDelete}
        userName={selectedDosen?.name || ""}
        userType="dosen"
        activeSchedules={activeSchedules}
      />
    </>
  );
}