// src/components/dashboard/dash-bottom.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface BottomSectionProps {
  role: string;
  bottomData: any;
}

export function BottomSection({ role, bottomData }: BottomSectionProps) {
  if (role === "ADMIN") {
    return <AdminBottomSection bottomData={bottomData} />;
  } else if (role === "DOSEN") {
    return <DosenBottomSection bottomData={bottomData} />;
  } else if (role === "MAHASISWA") {
    return <MahasiswaBottomSection bottomData={bottomData} />;
  }
  return null;
}

// Helper functions
const formatDate = (date: Date | null) => {
  if (!date) return "-";
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (date: Date | null) => {
  if (!date) return "-";
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Admin View - Daftar Penjadwalan Summary
function AdminBottomSection({ bottomData }: { bottomData: any }) {
  const examData = bottomData?.data || [];
  const displayData = examData.slice(0, 5); // Show first 5 for summary

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Daftar Penjadwalan</CardTitle>
          <Link href="/daftar-penjadwalan">
            <Button variant="link" className="text-blue-600">
              Lihat Semua
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-blue-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Nama Mahasiswa
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Tanggal Ujian
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Ruang Ujian
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Dosen Pembimbing
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Penguji 1
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Penguji 2
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada jadwal ujian
                  </td>
                </tr>
              ) : (
                displayData.map((item: any, index: number) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                          <AvatarImage src={item.foto || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white">
                            {item.namaMahasiswa?.[0] || "M"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{item.namaMahasiswa || "-"}</p>
                          <p className="text-xs text-gray-500">{item.nim || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(item.tanggal)}</td>
                    <td className="px-4 py-3 text-sm">{item.ruangan || "-"}</td>
                    <td className="px-4 py-3 text-sm">{item.dosenPembimbing || "-"}</td>
                    <td className="px-4 py-3 text-sm">{item.dosenPenguji1 || "-"}</td>
                    <td className="px-4 py-3 text-sm">{item.dosenPenguji2 || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Dosen View - Detail Jadwal Summary
function DosenBottomSection({ bottomData }: { bottomData: any }) {
  const [selectedUjianId, setSelectedUjianId] = useState<string | null>(null);
  const examData = bottomData?.data || [];
  const displayData = examData.slice(0, 5); // Show first 5 for summary

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Detail Jadwal</CardTitle>
          <Link href="/detail-jadwal">
            <Button variant="link" className="text-blue-600">
              Lihat Semua
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-blue-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Nama Mahasiswa
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Judul Tugas Akhir
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Jam
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Ruangan
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Peran
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada jadwal ujian
                  </td>
                </tr>
              ) : (
                displayData.map((item: any, index: number) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                          <AvatarImage src={item.foto || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white">
                            {item.namaMahasiswa?.[0] || "M"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{item.namaMahasiswa || "-"}</p>
                          <p className="text-xs text-gray-500">{item.nim || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate">
                      {item.judulTugasAkhir || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(item.tanggal)}</td>
                    <td className="px-4 py-3 text-sm">{formatTime(item.tanggal)}</td>
                    <td className="px-4 py-3 text-sm">{item.ruangan || "-"}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          item.isDosenPembimbing
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }
                      >
                        {item.isDosenPembimbing ? "Pembimbing" : "Penguji"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/detail-jadwal?id=${item.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Mahasiswa View - Detail Jadwal Summary
function MahasiswaBottomSection({ bottomData }: { bottomData: any }) {
  const examData = bottomData?.data || [];
  const displayData = examData.slice(0, 5); // Show first 5 for summary

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Detail Jadwal</CardTitle>
          <Link href="/detail-jadwal">
            <Button variant="link" className="text-blue-600">
              Lihat Semua
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-blue-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Judul Tugas Akhir
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Jenis Ujian
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jam</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Belum ada jadwal ujian
                  </td>
                </tr>
              ) : (
                displayData.map((item: any, index: number) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{(index + 1).toString().padStart(2, "0")}</td>
                    <td className="px-4 py-3 text-sm max-w-md truncate">
                      {item.judulTugasAkhir || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">Seminar Hasil</td>
                    <td className="px-4 py-3 text-sm">{formatDate(item.tanggal)}</td>
                    <td className="px-4 py-3 text-sm">{formatTime(item.tanggal) || "09:00"}</td>
                    <td className="px-4 py-3">
                      <Link href={`/detail-jadwal?id=${item.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}