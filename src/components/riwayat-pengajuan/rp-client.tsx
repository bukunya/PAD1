"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Calendar, Loader2 } from "lucide-react";
import { TimelineItem } from "./rp-timelineItem";
import { getNotifications } from "@/lib/actions/notifikasi/notifications";
import { PageHeader } from "@/components/page-header";

interface Notification {
  id: string;
  message: string;
  createdAt: Date;
  ujian: {
    judul: string;
    tanggalUjian: Date | null;
    jamMulai: Date | null;
    mahasiswa: {
      name: string | null;
    };
  };
}

interface RiwayatPengajuanClientProps {
  initialData: Notification[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  userRole: string;
}

export function RiwayatPengajuanClient({
  initialData,
  pagination: initialPagination,
  userRole,
}: RiwayatPengajuanClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialData);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPagination?.page || 1);
  const [hasMore, setHasMore] = useState(initialPagination?.hasMore || false);

  // Dynamic page configuration based on role
  const getPageConfig = () => {
    switch (userRole) {
      case "MAHASISWA":
        return {
          title: "Riwayat Pengajuan",
          description: "Pantau status dan riwayat pengajuan sidang tugas akhir Anda",
          emptyTitle: "Belum ada riwayat pengajuan",
          emptySubtitle: "Notifikasi akan muncul setelah Anda mengajukan ujian",
        };
      case "DOSEN":
        return {
          title: "Notifikasi",
          description: "Lihat notifikasi pengajuan ujian dari mahasiswa yang Anda bimbing/uji",
          emptyTitle: "Belum ada notifikasi ujian",
          emptySubtitle: "Notifikasi akan muncul ketika ada mahasiswa yang mengajukan ujian",
        };
      default:
        return {
          title: "Notifikasi",
          description: "Lihat semua notifikasi terkait pengajuan sidang",
          emptyTitle: "Belum ada notifikasi",
          emptySubtitle: "Notifikasi akan muncul di sini",
        };
    }
  };

  const pageConfig = getPageConfig();

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (selectedFilter !== "all") {
      const message = notif.message.toLowerCase();
      let matchesFilter = false;

      switch (selectedFilter) {
        case "submitted":
          matchesFilter =
            message.includes("dibuat") ||
            message.includes("disubmit") ||
            message.includes("diajukan");
          break;
        case "verified":
          matchesFilter =
            message.includes("diverifikasi") ||
            message.includes("disetujui") ||
            message.includes("diterima");
          break;
        case "scheduled":
          matchesFilter = message.includes("dijadwalkan");
          break;
        case "rejected":
          matchesFilter = message.includes("ditolak");
          break;
        default:
          matchesFilter = true;
      }

      if (!matchesFilter) return false;
    }

    return true;
  });

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const result = await getNotifications(currentPage + 1, 50);

      if (result.success && result.data) {
        setNotifications([...notifications, ...result.data]);
        setCurrentPage(result.pagination?.page || currentPage + 1);
        setHasMore(result.pagination?.hasMore || false);
      }
    } catch (error) {
      console.error("Error loading more notifications:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header with Role-based Title & Description */}
      <PageHeader
        title={pageConfig.title}
        description={pageConfig.description}
        action={
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="submitted">Diajukan</SelectItem>
                <SelectItem value="verified">Diverifikasi</SelectItem>
                <SelectItem value="scheduled">Dijadwalkan</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Content Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-muted-foreground text-lg mb-2">
                {pageConfig.emptyTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {pageConfig.emptySubtitle}
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredNotifications.map((notif, index) => (
                <TimelineItem
                  key={notif.id}
                  notification={notif}
                  isLast={index === filteredNotifications.length - 1}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && filteredNotifications.length > 0 && (
            <div className="mt-6 text-center border-t pt-6">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memuat...
                  </>
                ) : (
                  "Muat Lebih Banyak"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}