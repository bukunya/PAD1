// "use client";

// import * as React from "react";
// import { useState, useMemo } from "react";
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   getDay,
//   isEqual,
//   isSameDay,
//   isSameMonth,
// } from "date-fns";
// import { id } from "date-fns/locale";
// import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";
// import { useSession } from "next-auth/react";
// import { NavUser } from "@/components/nav-user";

// // Tipe data untuk acara ujian
// type UjianEvent = {
//   id: string;
//   title: string;
//   mahasiswa: string;
//   date: Date;
//   startTime: string;
//   color: "blue" | "yellow" | "pink";
// };

// // --- DATA CONTOH ---
// // Ganti ini dengan data dari database Anda melalui server action atau API
// const mockEvents: UjianEvent[] = [
//   {
//     id: "1",
//     title: "Ujian Tugas Akhir",
//     mahasiswa: "Andi Pratama",
//     date: new Date("2025-09-10T09:00:00"),
//     startTime: "09.00",
//     color: "blue",
//   },
//   {
//     id: "2",
//     title: "Ujian Tugas Akhir",
//     mahasiswa: "Budi Santoso",
//     date: new Date("2025-09-10T13:00:00"),
//     startTime: "13.00",
//     color: "yellow",
//   },
//   {
//     id: "3",
//     title: "Ujian TA",
//     mahasiswa: "Citra Lestari",
//     date: new Date("2025-09-12T11:00:00"),
//     startTime: "11.00",
//     color: "pink",
//   },
//   {
//     id: "4",
//     title: "Ujian TA",
//     mahasiswa: "Dewi Anggraini",
//     date: new Date("2025-09-12T15:00:00"),
//     startTime: "15.00",
//     color: "blue",
//   },
//   {
//     id: "5",
//     title: "Ujian Tugas Akhir",
//     mahasiswa: "Eka Wijaya",
//     date: new Date("2025-09-22T09:00:00"),
//     startTime: "09.00",
//     color: "blue",
//   },
//   {
//     id: "6",
//     title: "Ujian TA",
//     mahasiswa: "Fajar Nugroho",
//     date: new Date("2025-09-22T14:00:00"),
//     startTime: "14.00",
//     color: "pink",
//   },
//   {
//     id: "7",
//     title: "Ujian TA",
//     mahasiswa: "Gilang Ramadhan",
//     date: new Date("2025-09-25T10:00:00"),
//     startTime: "10.00",
//     color: "yellow",
//   },
// ];
// // --- AKHIR DATA CONTOH ---

// const colorClasses = {
//   blue: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
//   yellow: {
//     bg: "bg-yellow-100",
//     text: "text-yellow-800",
//     border: "border-yellow-300",
//   },
//   pink: { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-300" },
// };

// function KalenderUtamaPage() {
//   const [currentDate, setCurrentDate] = useState(new Date("2025-09-01"));
//   const [selectedDate, setSelectedDate] = useState(new Date("2025-09-10"));
//   const { data: session, status } = useSession();

//   if (status === "loading") {
//     return null;
//   }

//   if (!session) {
//     return null;
//   }

//   if (session.user?.role !== "ADMIN") {
//     return <div>Access Denied</div>;
//   }

//   const user = {
//     name: session.user?.name || "User",
//     email: session.user?.email || "",
//     avatar: session.user?.image || "",
//   };

//   const firstDayOfMonth = startOfMonth(currentDate);
//   const lastDayOfMonth = endOfMonth(currentDate);

//   const daysInMonth = eachDayOfInterval({
//     start: firstDayOfMonth,
//     end: lastDayOfMonth,
//   });

//   const startingDayIndex = getDay(firstDayOfMonth);

//   const eventsByDate = useMemo(() => {
//     return mockEvents.reduce((acc, event) => {
//       const dateKey = format(event.date, "yyyy-MM-dd");
//       if (!acc[dateKey]) {
//         acc[dateKey] = [];
//       }
//       acc[dateKey].push(event);
//       return acc;
//     }, {} as Record<string, UjianEvent[]>);
//   }, [mockEvents]);

//   const selectedDayEvents =
//     eventsByDate[format(selectedDate, "yyyy-MM-dd")] || [];

//   const changeMonth = (amount: number) => {
//     const newDate = new Date(
//       currentDate.setMonth(currentDate.getMonth() + amount)
//     );
//     setCurrentDate(newDate);
//   };

//   return (
//     <>
//       <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
//         <div className="flex items-center gap-2 px-4">
//           <SidebarTrigger className="-ml-1" />
//           <Separator
//             orientation="vertical"
//             className="mr-2 data-[orientation=vertical]:h-4"
//           />
//         </div>
//         <div className="ml-auto px-4">
//           <NavUser user={user} />
//         </div>
//       </header>
//       <div className="flex h-full flex-col lg:flex-row bg-muted/40 p-4 gap-4">
//         <div className="flex-1 lg:w-2/3">
//           <Card className="h-full">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => changeMonth(-1)}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//                 <h2 className="text-xl font-bold">
//                   {format(currentDate, "MMMM yyyy", { locale: id })}
//                 </h2>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => changeMonth(1)}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//               <Button>Lihat Daftar Penjadwalan</Button>
//             </CardHeader>
//             <CardContent className="p-0">
//               <div className="grid grid-cols-7 border-t">
//                 {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(
//                   (day) => (
//                     <div
//                       key={day}
//                       className="p-2 text-center text-sm font-medium text-muted-foreground border-r border-b"
//                     >
//                       {day}
//                     </div>
//                   )
//                 )}

//                 {/* Sel Kosong di Awal Bulan */}
//                 {Array.from({ length: startingDayIndex }).map((_, index) => (
//                   <div key={`empty-${index}`} className="border-r border-b" />
//                 ))}

//                 {/* Hari-hari dalam Sebulan */}
//                 {daysInMonth.map((day) => {
//                   const dateKey = format(day, "yyyy-MM-dd");
//                   const dayEvents = eventsByDate[dateKey] || [];
//                   return (
//                     <div
//                       key={day.toString()}
//                       className={cn(
//                         "relative h-32 border-r border-b p-2 cursor-pointer hover:bg-accent",
//                         isEqual(day, selectedDate) && "bg-accent",
//                         !isSameMonth(day, currentDate) &&
//                           "text-muted-foreground"
//                       )}
//                       onClick={() => setSelectedDate(day)}
//                     >
//                       <time
//                         dateTime={format(day, "yyyy-MM-dd")}
//                         className={cn(
//                           "font-medium",
//                           isSameDay(day, new Date()) &&
//                             "text-primary font-extrabold"
//                         )}
//                       >
//                         {format(day, "d")}
//                       </time>
//                       <div className="mt-1 space-y-1">
//                         {dayEvents.map((event) => (
//                           <Badge
//                             key={event.id}
//                             className={cn(
//                               "w-full justify-start truncate",
//                               colorClasses[event.color].bg,
//                               colorClasses[event.color].text
//                             )}
//                           >
//                             Ujian TA
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Kolom Agenda Harian */}
//         <div className="lg:w-1/3">
//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 {format(selectedDate, "d MMMM yyyy", { locale: id })}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {selectedDayEvents.length > 0 ? (
//                 selectedDayEvents
//                   .sort((a, b) => a.startTime.localeCompare(b.startTime))
//                   .map((event) => (
//                     <div key={event.id} className="flex items-start gap-4">
//                       <div className="flex flex-col items-center">
//                         <span className="font-semibold">{event.startTime}</span>
//                         <GripVertical className="h-6 w-6 text-muted-foreground" />
//                       </div>
//                       <div
//                         className={cn(
//                           "flex-1 p-4 rounded-lg border-l-4",
//                           colorClasses[event.color].bg,
//                           colorClasses[event.color].border
//                         )}
//                       >
//                         <p
//                           className={cn(
//                             "font-bold",
//                             colorClasses[event.color].text
//                           )}
//                         >
//                           {event.title}
//                         </p>
//                         <p
//                           className={cn(
//                             "text-sm",
//                             colorClasses[event.color].text
//                           )}
//                         >
//                           {event.mahasiswa}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//               ) : (
//                 <p className="text-center text-muted-foreground py-8">
//                   Tidak ada jadwal ujian pada tanggal ini.
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// }

// export default KalenderUtamaPage;

"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar"; // Diimpor dari Shadcn UI

// Tipe data untuk acara ujian
type UjianEvent = {
  id: string;
  title: string;
  mahasiswa: string;
  date: Date;
  startTime: string;
  color: "blue" | "yellow" | "pink";
};

// --- DATA CONTOH ---
// Ganti ini dengan data dari database Anda melalui server action atau API
const mockEvents: UjianEvent[] = [
  {
    id: "1",
    title: "Ujian Tugas Akhir",
    mahasiswa: "Andi Pratama",
    date: new Date("2025-10-10T09:00:00"),
    startTime: "09.00",
    color: "blue",
  },
  {
    id: "2",
    title: "Ujian Tugas Akhir",
    mahasiswa: "Budi Santoso",
    date: new Date("2025-10-10T13:00:00"),
    startTime: "13.00",
    color: "yellow",
  },
  {
    id: "3",
    title: "Ujian TA",
    mahasiswa: "Citra Lestari",
    date: new Date("2025-10-12T11:00:00"),
    startTime: "11.00",
    color: "pink",
  },
  {
    id: "4",
    title: "Ujian TA",
    mahasiswa: "Dewi Anggraini",
    date: new Date("2025-10-12T15:00:00"),
    startTime: "15.00",
    color: "blue",
  },
  {
    id: "5",
    title: "Ujian Tugas Akhir",
    mahasiswa: "Eka Wijaya",
    date: new Date("2025-10-22T09:00:00"),
    startTime: "09.00",
    color: "blue",
  },
  {
    id: "6",
    title: "Ujian TA",
    mahasiswa: "Fajar Nugroho",
    date: new Date("2025-10-22T14:00:00"),
    startTime: "14.00",
    color: "pink",
  },
  {
    id: "7",
    title: "Ujian TA",
    mahasiswa: "Gilang Ramadhan",
    date: new Date("2025-10-25T10:00:00"),
    startTime: "10.00",
    color: "yellow",
  },
];
// --- AKHIR DATA CONTOH ---

const colorClasses = {
  blue: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-300",
  },
  pink: { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-300" },
};

function KalenderUtamaPage() {
  const today = new Date();
  const [month, setMonth] = useState(new Date("2025-10-01"));
  const [selected, setSelected] = useState<Date | undefined>(
    new Date("2025-10-10")
  );

  const eventsByDate = useMemo(() => {
    return mockEvents.reduce((acc, event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, UjianEvent[]>);
  }, []);

  const selectedDayEvents = selected
    ? eventsByDate[format(selected, "yyyy-MM-dd")] || []
    : [];

  const changeMonth = (amount: number) => {
    setMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + amount);
      return newMonth;
    });
  };

  return (
    <div className="flex h-full flex-col lg:flex-row bg-muted/40 p-4 gap-4">
      {/* Kolom Kalender Utama */}
      <div className="flex-1 lg:w-2/3">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold">
                {format(month, "MMMM yyyy", { locale: id })}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button>Lihat Daftar Penjadwalan</Button>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-0">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              month={month}
              onMonthChange={setMonth}
              className="w-full h-full"
              classNames={{
                months:
                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full h-full",
                month: "space-y-4 w-full h-full flex flex-col",
                table: "w-full h-full border-collapse",
                head_row: "flex border-b",
                head_cell:
                  "text-muted-foreground w-full justify-center font-medium text-sm p-2 border-r last:border-r-0",
                row: "flex w-full",
                cell: "h-full w-full text-center text-sm p-0 relative border-r border-b last:border-r-0",
                day: "h-full w-full p-0",
              }}
              components={{
                DayButton: ({ day, ...props }) => {
                  const dateKey = format(day.date, "yyyy-MM-dd");
                  const dayEvents = eventsByDate[dateKey] || [];
                  const dayNumber = format(day.date, "d");
                  const isSelected = selected && isSameDay(day.date, selected);
                  const isToday = isSameDay(day.date, today);

                  return (
                    <Button
                      {...props}
                      variant="ghost"
                      className={cn(
                        "h-28 w-full flex flex-col items-start justify-start p-2 relative rounded-none hover:bg-blue-50 transition-colors",
                        isToday && "bg-blue-50/50",
                        isSelected &&
                          "bg-blue-100 ring-2 ring-blue-500 ring-inset"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-medium mb-1",
                          isToday && "text-primary font-bold",
                          isSelected && "text-blue-700 font-bold"
                        )}
                      >
                        {dayNumber}
                      </span>
                      <div className="space-y-0.5 w-full overflow-hidden">
                        {dayEvents.map((event) => (
                          <Badge
                            key={event.id}
                            className={cn(
                              "w-full justify-start text-[10px] px-1 py-0 h-4 truncate leading-tight",
                              colorClasses[event.color].bg,
                              colorClasses[event.color].text
                            )}
                          >
                            Ujian TA
                          </Badge>
                        ))}
                      </div>
                    </Button>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Kolom Agenda Harian */}
      <div className="lg:w-1/3">
        <Card>
          <CardHeader>
            <CardTitle>
              {selected
                ? format(selected, "d MMMM yyyy", { locale: id })
                : "Pilih tanggal"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((event) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">{event.startTime}</span>
                      <GripVertical className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div
                      className={cn(
                        "flex-1 p-4 rounded-lg border-l-4",
                        colorClasses[event.color].bg,
                        colorClasses[event.color].border
                      )}
                    >
                      <p
                        className={cn(
                          "font-bold",
                          colorClasses[event.color].text
                        )}
                      >
                        {event.title}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          colorClasses[event.color].text
                        )}
                      >
                        {event.mahasiswa}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Tidak ada jadwal ujian pada tanggal ini.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default KalenderUtamaPage;
