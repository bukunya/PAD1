// src/components/pengajuan/pengajuan-table.tsx
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { PengajuanModalVerify } from "./p-modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Pengajuan {
  id: string;
  judul: string;
  berkasUrl: string;
  status: string;
  createdAt: Date;
  tanggalUjian: Date | null;
  mahasiswa: {
    id: string;
    name: string | null;
    nim: string | null;
    prodi: string | null;
    image: string | null;
  };
  dosenPembimbing: {
    id: string;
    name: string | null;
  };
}

interface PengajuanTableProps {
  initialData: Pengajuan[];
}

const ITEMS_PER_PAGE = 10;

export default function PengajuanTable({ initialData }: PengajuanTableProps) {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPengajuanId, setSelectedPengajuanId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      // Filter by month
      if (selectedMonth !== "all") {
        const itemDate = new Date(item.createdAt);
        if (itemDate.getMonth() !== parseInt(selectedMonth)) {
          return false;
        }
      }

      // Filter by status
      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [initialData, selectedMonth, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      MENUNGGU_VERIFIKASI: {
        label: "Menunggu Verifikasi",
        className: "bg-yellow-100 text-yellow-700",
      },
      DITERIMA: {
        label: "Diterima",
        className: "bg-blue-100 text-blue-700",
      },
      DITOLAK: {
        label: "Ditolak",
        className: "bg-red-100 text-red-700",
      },
      DIJADWALKAN: {
        label: "Dijadwalkan",
        className: "bg-green-100 text-green-700",
      },
      SELESAI: {
        label: "Selesai",
        className: "bg-gray-100 text-gray-700",
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-700",
    };

    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl">Daftar Pengajuan</CardTitle>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Bulan</SelectItem>
                    <SelectItem value="0">Januari</SelectItem>
                    <SelectItem value="1">Februari</SelectItem>
                    <SelectItem value="2">Maret</SelectItem>
                    <SelectItem value="3">April</SelectItem>
                    <SelectItem value="4">Mei</SelectItem>
                    <SelectItem value="5">Juni</SelectItem>
                    <SelectItem value="6">Juli</SelectItem>
                    <SelectItem value="7">Agustus</SelectItem>
                    <SelectItem value="8">September</SelectItem>
                    <SelectItem value="9">Oktober</SelectItem>
                    <SelectItem value="10">November</SelectItem>
                    <SelectItem value="11">Desember</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="MENUNGGU_VERIFIKASI">
                    Menunggu Verifikasi
                  </SelectItem>
                  <SelectItem value="DITERIMA">Diterima</SelectItem>
                  <SelectItem value="DITOLAK">Ditolak</SelectItem>
                  <SelectItem value="DIJADWALKAN">Dijadwalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="space y-6 p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="font-semibold">Nama Mahasiswa</TableHead>
                  <TableHead className="font-semibold">Judul Tugas Akhir</TableHead>
                  <TableHead className="font-semibold">
                    Tanggal Pengajuan
                  </TableHead>
                  <TableHead className="font-semibold">Status Pengajuan</TableHead>
                  <TableHead className="font-semibold text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada data pengajuan
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={item.mahasiswa.image || ""}
                              alt={item.mahasiswa.name || ""}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white">
                              {item.mahasiswa.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "M"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {item.mahasiswa.name || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.mahasiswa.nim || "-"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{item.judul}</p>
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600"
                          onClick={() => setSelectedPengajuanId(item.id)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <span className="px-4">...</span>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Verify */}
      {selectedPengajuanId && (
        <PengajuanModalVerify
          pengajuanId={selectedPengajuanId}
          onClose={() => setSelectedPengajuanId(null)}
        />
      )}
    </>
  );
}