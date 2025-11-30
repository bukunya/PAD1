"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function RiwayatPengajuanClient({
  initialData,
  pagination: initialPagination,
  userRole, 
}: RiwayatPengajuanClientProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialData);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPagination?.page || 1);
  const [hasMore, setHasMore] = useState(initialPagination?.hasMore || false);

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notif) => {
    if (selectedFilter === "all") return true;

    const message = notif.message.toLowerCase();

    switch (selectedFilter) {
      case "submitted":
        return (
          message.includes("dibuat") ||
          message.includes("disubmit") ||
          message.includes("diajukan")
        );
      case "verified":
        return (
          message.includes("diverifikasi") ||
          message.includes("disetujui") ||
          message.includes("diterima")
        );
      case "scheduled":
        return message.includes("dijadwalkan");
      case "rejected":
        return message.includes("ditolak");
      default:
        return true;
    }
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

  // Dynamic empty state message based on role
  const getEmptyStateMessage = () => {
    switch (userRole) {
      case "MAHASISWA":
        return {
          title: "Belum ada riwayat pengajuan",
          subtitle: "Notifikasi akan muncul setelah Anda mengajukan ujian",
        };
      case "DOSEN":
        return {
          title: "Belum ada notifikasi ujian",
          subtitle:
            "Notifikasi akan muncul ketika ada mahasiswa yang mengajukan ujian",
        };
      case "ADMIN":
        return {
          title: "Belum ada notifikasi pengajuan",
          subtitle: "Notifikasi akan muncul ketika ada pengajuan baru",
        };
      default:
        return {
          title: "Belum ada notifikasi",
          subtitle: "Notifikasi akan muncul di sini",
        };
    }
  };

  const emptyState = getEmptyStateMessage();

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-xl">Timeline Notifikasi</CardTitle>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[200px]">
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
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-muted-foreground text-lg mb-2">
              {emptyState.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {emptyState.subtitle}
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
  );
}