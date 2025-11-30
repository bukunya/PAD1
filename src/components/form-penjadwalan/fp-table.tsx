// src/components/form-penjadwalan/penjadwalan-table.tsx
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { PenjadwalanModal } from "./fp-modal";
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

interface PenjadwalanTableProps {
  initialData: Pengajuan[];
}

const ITEMS_PER_PAGE = 10;

export default function PenjadwalanTable({
  initialData,
}: PenjadwalanTableProps) {
  const [selectedMonth, setSelectedMonth] = useState("all");
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

      return true;
    });
  }, [initialData, selectedMonth]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
            <CardTitle className="text-xl">
              Daftar Pengajuan yang Siap Dijadwalkan
            </CardTitle>

            {/* Filter */}
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
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="space y-6 p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="font-semibold">Nama Mahasiswa</TableHead>
                  <TableHead className="font-semibold">
                    Judul Tugas Akhir
                  </TableHead>
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
                      Tidak ada pengajuan yang siap dijadwalkan
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
                            <p className="font-medium text-center">
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
                      <TableCell>
                        <span className="text-blue-600 font-medium text-center">
                          Menunggu Penjadwalan
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => setSelectedPengajuanId(item.id)}
                        >
                          Jadwalkan
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
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
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

      {/* Modal Jadwalkan */}
      {selectedPengajuanId && (
        <PenjadwalanModal
          pengajuanId={selectedPengajuanId}
          onClose={() => setSelectedPengajuanId(null)}
        />
      )}
    </>
  );
}