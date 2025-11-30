// src/components/dashboard/dash-top.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, CheckCircle, Clock, GraduationCap, MapPin } from "lucide-react";

interface TopSectionProps {
  role: string;
  topData: any;
}

export function TopSection({ role, topData }: TopSectionProps) {
  if (role === "ADMIN") {
    return <AdminTopSection topData={topData} />;
  } else if (role === "DOSEN") {
    return <DosenTopSection topData={topData} />;
  } else if (role === "MAHASISWA") {
    return <MahasiswaTopSection topData={topData} />;
  }
  return null;
}

// Admin Statistics - ALL DATA FROM BACKEND
function AdminTopSection({ topData }: { topData: any }) {
  const stats = [
    {
      label: "Mahasiswa Aktif",
      value: topData?.jumlahMahasiswa || 0,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Dosen Aktif",
      value: topData?.jumlahDosen || 0,
      icon: Users,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      label: "Jadwal Ujian Terdekat",
      value: topData?.data?.length || 0,
      icon: Calendar,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      label: "Ujian Selesai Bulan Ini",
      value: topData?.ujianSelesaiBulanIni || 0, // ✅ NOW FROM BACKEND
      icon: CheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Dosen Statistics - ALL DATA FROM BACKEND
function DosenTopSection({ topData }: { topData: any }) {
  const stats = [
    {
      label: "Ujian Mendatang",
      value: topData?.data?.length || 0,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Mahasiswa Dibimbing",
      value: topData?.jumlahMahasiswaBimbingan || 0,
      icon: Users,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      label: "Ujian Selesai Bulan Ini",
      value: topData?.ujianSelesaiBulanIni || 0, // ✅ NOW FROM BACKEND
      icon: CheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Jadwal Ujian Ditunda",
      value: topData?.jadwalDitunda || 0, // ✅ NOW FROM BACKEND (will be 0 if status doesn't exist)
      icon: Clock,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Mahasiswa Statistics - Different Layout (2 cards side by side)
function MahasiswaTopSection({ topData }: { topData: any }) {
  const statusPengajuan = topData?.statusPengajuan || "BELUM_MENGAJUKAN";
  const upcomingExam = topData?.data?.[0];

  const statusConfig: Record<
    string,
    { label: string; displayLabel: string; bgColor: string; textColor: string; iconBg: string }
  > = {
    MENUNGGU_VERIFIKASI: {
      label: "Menunggu Verifikasi",
      displayLabel: "Menunggu Verifikasi",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      iconBg: "bg-yellow-100",
    },
    DITERIMA: {
      label: "Diterima",
      displayLabel: "Diterima",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      iconBg: "bg-green-100",
    },
    DITOLAK: {
      label: "Ditolak",
      displayLabel: "Ditolak",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      iconBg: "bg-red-100",
    },
    DIJADWALKAN: {
      label: "Sudah Dijadwalkan",
      displayLabel: "Sudah Dijadwalkan",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      iconBg: "bg-blue-100",
    },
    SELESAI: {
      label: "Selesai",
      displayLabel: "Selesai",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      iconBg: "bg-gray-100",
    },
    BELUM_MENGAJUKAN: {
      label: "Belum Mengajukan",
      displayLabel: "Belum Mengajukan",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      iconBg: "bg-gray-100",
    },
  };

  const currentStatus = statusConfig[statusPengajuan] || statusConfig.BELUM_MENGAJUKAN;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Status Pengajuan */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${currentStatus.iconBg}`}>
              <Calendar className={`h-6 w-6 ${currentStatus.textColor}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Status Pengajuan Ujian</p>
              <p className={`text-xl font-bold ${currentStatus.textColor}`}>
                {currentStatus.displayLabel}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tempat Ruang Ujian */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Tempat Ruang Ujian</p>
              <p className="text-xl font-bold text-gray-800">
                {upcomingExam?.ruangan || "Belum Dijadwalkan"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}