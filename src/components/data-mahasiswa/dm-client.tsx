"use client";

import { MahasiswaTable } from "./dm-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";

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

interface MahasiswaClientProps {
  mahasiswa: MahasiswaData[];
  dosenList: Array<{ id: string; name: string | null }>;
}

export function MahasiswaClient({
  mahasiswa,
  dosenList,
}: MahasiswaClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMahasiswa = useMemo(() => {
    if (!searchQuery.trim()) return mahasiswa;

    const query = searchQuery.toLowerCase();
    return mahasiswa.filter(
      (mhs) =>
        mhs.name?.toLowerCase().includes(query) ||
        mhs.nim?.toLowerCase().includes(query)
    );
  }, [mahasiswa, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          title="Data Mahasiwa"
          description="Kelola informasi mahasiswa yang terdaftar"
        />
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan Nama atau NIM"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      <MahasiswaTable
        mahasiswa={filteredMahasiswa}
        dosenList={dosenList}
        currentPage={currentPage}
      />
    </div>
  );
}