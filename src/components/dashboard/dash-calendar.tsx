// src/components/dashboard/dash-calendar.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

interface CalendarProps {
  upcomingExams: any[];
  role: string;
}

export function Calendar({ upcomingExams, role }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const getMonthYear = () => {
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Previous month padding
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    return days;
  };

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    
    upcomingExams.forEach(exam => {
      const examDate = exam.jamMulai ? new Date(exam.jamMulai) : exam.tanggal ? new Date(exam.tanggal) : null;
      if (examDate) {
        const dateKey = examDate.toDateString();
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(exam);
      }
    });
    
    return grouped;
  }, [upcomingExams]);

  const hasExamOnDay = (day: number) => {
    if (!upcomingExams || upcomingExams.length === 0) return false;

    return upcomingExams.some((exam) => {
      const examDate = exam.jamMulai ? new Date(exam.jamMulai) : exam.tanggal ? new Date(exam.tanggal) : null;
      if (!examDate) return false;
      
      return (
        examDate.getDate() === day &&
        examDate.getMonth() === currentDate.getMonth() &&
        examDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const formatTime = (date: Date | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getAgendaForToday = () => {
    const today = new Date();
    const todayKey = today.toDateString();
    return eventsByDate[todayKey] || [];
  };

  const days = getDaysInMonth();
  const todayAgenda = getAgendaForToday();

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <CardTitle className="text-base font-semibold">{getMonthYear()}</CardTitle>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((dateObj, index) => {
            const { day, isCurrentMonth } = dateObj;
            const hasExam = day && isCurrentMonth && hasExamOnDay(day);
            const isTodayDate = day && isCurrentMonth && isToday(day);

            return (
              <div
                key={index}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-lg
                  ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                  ${isTodayDate ? "bg-blue-100 font-bold border-2 border-blue-500" : ""}
                  ${hasExam && !isTodayDate ? "bg-purple-50 text-purple-700 font-semibold" : ""}
                  ${hasExam && isTodayDate ? "bg-purple-100 text-purple-700 font-bold" : ""}
                  ${isCurrentMonth && !hasExam && !isTodayDate ? "hover:bg-gray-50" : ""}
                `}
              >
                {day || ""}
              </div>
            );
          })}
        </div>

        {/* Agenda Hari Ini */}
        <div className="pt-4 border-t">
          <CardTitle className="text-base font-semibold mb-3">Agenda Hari Ini</CardTitle>

          {todayAgenda.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Tidak ada agenda hari ini</p>
          ) : (
            <div className="space-y-3">
              {todayAgenda.map((exam, index) => (
                <div key={index} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {role === "ADMIN" || role === "DOSEN" 
                          ? exam.namaMahasiswa || "Ujian Tugas Akhir"
                          : "Ujian Tugas Akhir"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatTime(exam.jamMulai)} - {formatTime(exam.jamSelesai)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ruangan {exam.ruangan || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}