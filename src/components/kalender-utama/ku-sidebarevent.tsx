"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";

interface EventData {
  id: string;
  namaMahasiswa?: string | null;
  foto?: string | null;
  judulTugasAkhir?: string | null;
  judul?: string | null;
  tanggal: Date | null;
  jamMulai: Date | null;
  jamSelesai: Date | null;
}

interface KuSidebarEventProps {
  selectedDate: Date | null;
  events: EventData[];
  userRole: string;
}

const COLORS = [
  "bg-blue-100",
  "bg-yellow-100",
  "bg-pink-100",
  "bg-green-100",
  "bg-purple-100",
];

export default function KuSidebarEvent({ selectedDate, events, userRole }: KuSidebarEventProps) {
  const router = useRouter();

  const formatTime = (date: Date | null) => {
    if (!date) return "-";
    return format(new Date(date), "HH:mm", { locale: id });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: id });
  };

  return (
    <div className="w-80 space-y-4">
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="mb-4 flex items-center gap-2 text-gray-600">
          <Calendar className="h-5 w-5" />
          <h3 className="font-semibold">
            {selectedDate ? formatDate(selectedDate) : "Pilih tanggal"}
          </h3>
        </div>

        {!selectedDate && (
          <p className="text-sm text-gray-500">
            Klik pada tanggal di kalender untuk melihat jadwal
          </p>
        )}

        {selectedDate && events.length === 0 && (
          <p className="text-sm text-gray-500">
            Tidak ada jadwal pada tanggal ini
          </p>
        )}

        {selectedDate && events.length > 0 && (
          <div className="space-y-3">
            {events.map((event, index) => {
              const title = userRole === "MAHASISWA" 
                ? (event.judul || "Ujian Tugas Akhir")
                : (event.judulTugasAkhir || "Ujian Tugas Akhir");
              
              const studentName = userRole === "MAHASISWA" 
                ? "Ujian Anda"
                : (event.namaMahasiswa || "Mahasiswa");

              return (
                <div
                  key={event.id}
                  onClick={() => router.push(`/detail-jadwal/${event.id}`)}
                  className={`
                    cursor-pointer rounded-lg border p-3 transition
                    hover:shadow-md ${COLORS[index % COLORS.length]}
                  `}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                      {event.foto ? (
                        <Image
                          src={event.foto}
                          alt={studentName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm font-medium text-gray-600">
                          {studentName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{studentName}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        {formatTime(event.jamMulai)} - {formatTime(event.jamSelesai)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 line-clamp-2">
                    {title}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {formatDate(event.tanggal)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}