"use client";

import { RiwayatUjianTable } from "./ru-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface RiwayatUjianClientProps {
  data: RiwayatUjianData[];
  pagination: PaginationInfo;
  statusFilter: string;
  peranFilter: string;
}

export function RiwayatUjianClient({
  data,
  pagination,
}: RiwayatUjianClientProps) {
  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    window.location.href = url.toString();
  };

  const renderPageNumbers = () => {
    const pages = [];
    const { page, totalPages } = pagination;

    if (page > 2) {
      pages.push(
        <Button
          key={1}
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(1)}
          className="h-8 w-8"
        >
          1
        </Button>
      );
    }

    if (page > 3) {
      pages.push(
        <span key="ellipsis-start" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) {
      pages.push(
        <Button
          key={i}
          variant={i === page ? "default" : "ghost"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={`h-8 w-8 ${
            i === page
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          {i}
        </Button>
      );
    }

    if (page < totalPages - 2) {
      pages.push(
        <span key="ellipsis-end" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    if (page < totalPages - 1) {
      pages.push(
        <Button
          key={totalPages}
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className="h-8 w-8"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      <RiwayatUjianTable data={data} />

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {renderPageNumbers()}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasMore}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        Menampilkan {data.length} dari {pagination.total} ujian
      </div>
    </div>
  );
}

// Export filter component separately
export function RiwayatUjianFilters({ 
  statusFilter, 
  peranFilter 
}: { 
  statusFilter: string; 
  peranFilter: string;
}) {
  const handleFilterChange = (filterType: string, value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", "1");
    
    if (value === "semua") {
      url.searchParams.delete(filterType);
    } else {
      url.searchParams.set(filterType, value);
    }
    
    window.location.href = url.toString();
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select 
        value={statusFilter} 
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Status</SelectItem>
          <SelectItem value="selesai">Selesai</SelectItem>
          <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        value={peranFilter} 
        onValueChange={(value) => handleFilterChange("peran", value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Peran" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Peran</SelectItem>
          <SelectItem value="pembimbing">Pembimbing</SelectItem>
          <SelectItem value="penguji">Penguji</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}