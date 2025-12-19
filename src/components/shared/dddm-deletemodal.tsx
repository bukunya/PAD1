"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Calendar, Clock, MapPin, User } from "lucide-react";
import { useState } from "react";

// ✅ Interface yang fleksibel untuk data null dari DB
export interface ScheduleDetail {
  tanggalUjian: Date | null;
  jamMulai: Date | null;
  jamSelesai: Date | null;
  ruangan?: {
    nama: string;
  } | null;
  mahasiswa: {
    name: string | null;
    nim: string | null;
  };
  judul: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
  userType: "mahasiswa" | "dosen";
  activeSchedules?: ScheduleDetail[];
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userType,
  activeSchedules = [],
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const hasActiveSchedules = activeSchedules && activeSchedules.length > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Tanggal belum ditentukan";
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "--:--";
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit", minute: "2-digit", hour12: false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">
            {hasActiveSchedules ? "Tidak Dapat Menghapus Data" : "Hapus Data"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {hasActiveSchedules
              ? `${userType === "dosen" ? "Dosen" : "Mahasiswa"} ini memiliki jadwal ujian aktif yang harus diselesaikan terlebih dahulu.`
              : `Apakah anda yakin akan menghapus data ${userType} ini?`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 border text-center font-medium text-gray-900">
            {userName}
          </div>

          {hasActiveSchedules && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Jadwal Ujian Aktif ({activeSchedules.length})
              </p>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {activeSchedules.map((schedule, index) => (
                  <div key={index} className="rounded-lg border border-orange-200 bg-orange-50 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatDate(schedule.tanggalUjian)}</p>
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                          <Clock className="h-3.5 w-3.5" /> {formatTime(schedule.jamMulai)} - {formatTime(schedule.jamSelesai)} WIB
                        </p>
                      </div>
                    </div>
                    {schedule.ruangan && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-orange-600 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{schedule.ruangan.nama}</p>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{schedule.mahasiswa.name || "Nama tidak tersedia"}</p>
                        <p className="text-xs text-gray-600">NIM: {schedule.mahasiswa.nim || "-"}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-orange-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">Judul Skripsi:</p>
                      <p className="text-sm text-gray-900 line-clamp-2">&quot;{schedule.judul}&quot;</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-center mt-4">
          <Button variant="outline" onClick={onClose} disabled={isDeleting} className="flex-1">
            {hasActiveSchedules ? "Tutup" : "Batal"}
          </Button>
          {!hasActiveSchedules && (
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="flex-1">
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus...</> : "Ya, Hapus"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}