"use client";

import { useState } from "react";
import { Eye, Filter, ChevronDown, Clock, MapPin, User } from "lucide-react";

interface JadwalItem {
  id: string;
  judul: string;
  jenisUjian: string;
  tanggal: string;
  jam: string;
  ruangan?: string;
  mahasiswa: {
    name: string;
    nim: string;
  };
  dosenPembimbing: {
    name: string;
  };
  dosenPenguji: Array<{
    name: string;
  }>;
  status: 'MENUNGGU_VERIFIKASI' | 'DIJADWALKAN' | 'DITOLAK' | 'SELESAI';
}

interface DetailJadwalTableProps {
  jadwalList: JadwalItem[];
}

const STATUS_LABELS = {
  MENUNGGU_VERIFIKASI: 'Menunggu Verifikasi',
  DIJADWALKAN: 'Dijadwalkan',
  DITOLAK: 'Ditolak',
  SELESAI: 'Selesai'
};

const STATUS_COLORS = {
  MENUNGGU_VERIFIKASI: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  DIJADWALKAN: 'bg-blue-100 text-blue-800 border-blue-200',
  DITOLAK: 'bg-red-100 text-red-800 border-red-200',
  SELESAI: 'bg-green-100 text-green-800 border-green-200'
};

export default function DetailJadwalTable({ jadwalList }: DetailJadwalTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('Semua Peran');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  const statusOptions = ['Semua Peran', ...Object.values(STATUS_LABELS)];

  // Filter data berdasarkan status yang dipilih
  const filteredJadwal = jadwalList.filter(item => {
    if (statusFilter === 'Semua Peran') return true;
    return STATUS_LABELS[item.status] === statusFilter;
  });

  const handleDetailClick = (id: string) => {
    // Navigate to detail page or open modal
    console.log('View detail for:', id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Detail Jadwal</h2>
        
        <div className="flex gap-3">
          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Status</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setStatusFilter(option);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors ${
                        statusFilter === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Filter */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium">{statusFilter}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-4 font-semibold text-gray-700">ID</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Judul Tugas Akhir</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Jenis Ujian</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Tanggal</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Jam</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredJadwal.length > 0 ? (
              filteredJadwal.map((item, index) => (
                <tr 
                  key={item.id} 
                  className="border-b border-gray-50 hover:bg-gray-25 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="max-w-md">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.judul}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          <span>{item.mahasiswa.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>NIM: {item.mahasiswa.nim}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[item.status]}`}>
                      {item.jenisUjian}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{item.tanggal}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{item.jam}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleDetailClick(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Eye size={14} />
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Clock size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Belum Ada Jadwal</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Jadwal ujian akan muncul setelah pengajuan disetujui
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      {filteredJadwal.length > 0 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Menampilkan {filteredJadwal.length} dari {jadwalList.length} jadwal
          </p>
          
          <div className="text-sm text-gray-500">
            Filter: <span className="font-medium text-gray-700">{statusFilter}</span>
          </div>
        </div>
      )}
    </div>
  );
}