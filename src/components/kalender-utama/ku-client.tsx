"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import KuEvent from "./ku-event";
import KuSidebarEvent from "./ku-sidebarevent";

interface EventData {
  id: string;
  namaMahasiswa?: string | null;
  nim?: string | null;
  foto?: string | null;
  judulTugasAkhir?: string | null;
  judul?: string | null;
  tanggal: Date | null;
  jamMulai: Date | null;
  jamSelesai: Date | null;
  ruangan?: string | null;
  isDosenPembimbing?: boolean;
  prodi?: string | null;
  angkatan?: string | null;
  dosenPembimbing?: string | null;
  dosenPenguji?: string[];
}

interface KalenderUtamaClientProps {
  initialData: EventData[];
  userRole: string;
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function KalenderUtamaClient({ initialData, userRole }: KalenderUtamaClientProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push(prevDate);
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  }, [currentDate]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, EventData[]> = {};
    
    initialData.forEach(event => {
      if (event.tanggal) {
        const dateKey = new Date(event.tanggal).toDateString();
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      }
    });
    
    return grouped;
  }, [initialData]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = selectedDate.toDateString();
    return eventsByDate[dateKey] || [];
  }, [selectedDate, eventsByDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kalender Utama</h1>
        {userRole === "ADMIN" && (
          <button
            onClick={() => router.push("/daftar-penjadwalan")}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
            Lihat Daftar Penjadwalan
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Calendar */}
        <div className="flex-1 rounded-lg bg-white p-6 shadow">
          {/* Calendar Header */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="rounded p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={handleNextMonth}
              className="rounded p-2 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="mb-2 grid grid-cols-7 gap-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              if (!date) return <div key={index} />;
              
              const dateKey = date.toDateString();
              const dayEvents = eventsByDate[dateKey] || [];
              const inCurrentMonth = isCurrentMonth(date);
              
              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`
                    h-[120px] flex flex-col justify-between
                    cursor-pointer rounded-lg border p-2 transition
                    ${inCurrentMonth ? "bg-white" : "bg-gray-50"}
                    ${isToday(date) ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                    ${isSelected(date) ? "ring-2 ring-blue-400" : ""}
                    hover:border-blue-300
                  `}
                >
                  <div className={`
                    mb-2 text-sm font-medium
                    ${!inCurrentMonth ? "text-gray-400" : "text-gray-700"}
                    ${isToday(date) ? "text-blue-600" : ""}
                  `}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <KuEvent key={event.id} event={event} colorIndex={idx} />
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} lainnya
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <KuSidebarEvent 
          selectedDate={selectedDate} 
          events={selectedDateEvents}
          userRole={userRole}
        />
      </div>
    </div>
  );
}