"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Filter } from "lucide-react";
import DpTable from "./rnl-table";
import { getAdminJadwal, type AdminJadwalData } from "@/lib/actions/detailJadwal/adminJadwal";

export default function DaftarPenjadwalanClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AdminJadwalData[]>([]);
  const [filteredData, setFilteredData] = useState<AdminJadwalData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProdi, setSelectedProdi] = useState<string>("all");
  const [selectedAngkatan, setSelectedAngkatan] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const itemsPerPage = 10;

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [data, searchQuery, selectedProdi, selectedAngkatan, selectedMonth, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAdminJadwal();
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...data];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.namaMahasiswa?.toLowerCase().includes(query) ||
          item.nim?.toLowerCase().includes(query)
      );
    }

    // Prodi filter
    if (selectedProdi !== "all") {
      filtered = filtered.filter(item => item.prodi === selectedProdi);
    }

    // Angkatan filter
    if (selectedAngkatan !== "all") {
      filtered = filtered.filter(item => item.angkatan === selectedAngkatan);
    }

    // Month filter
    if (selectedMonth !== "all") {
      filtered = filtered.filter(item => {
        if (!item.tanggal) return false;
        const month = new Date(item.tanggal).getMonth();
        return month === parseInt(selectedMonth);
      });
    }

    // Pagination
    const total = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(total);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredData(filtered.slice(startIndex, endIndex));
  };

  // Get unique values for filters
  const uniqueProdi = Array.from(new Set(data.map(item => item.prodi).filter(Boolean)));
  const uniqueAngkatan = Array.from(new Set(data.map(item => item.angkatan).filter(Boolean))).sort().reverse();

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Riwayat dan Laporan</h1>
        </div>
        <button
            // onClick={() => router.push("/kalender-utama")}
            className="rounded-lg bg-blue-500 px-2 py-2 text-white transition hover:bg-blue-600">
            Save Report
          </button>
      </div>

      {/* Table */}
      <DpTable
        data={filteredData}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}