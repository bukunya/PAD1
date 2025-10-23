"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { dashboardDetailJadwal } from "@/lib/actions/dashboardDetailJadwal";
import Image from "next/image";

export default function Page() {
  const { data: session, status } = useSession();
  const [dataRole, setDataRole] = useState<any[]>([]);
  const [date, setDate] = useState<Date>();

  if (status === "loading") {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="font-medium">Mengambil Data...</p>
      </Card>
    );
  }
  if (!session) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="font-medium">
          Anda harus login untuk melihat halaman ini.
        </p>
      </Card>
    );
  }
  if (session.user?.role !== "DOSEN") {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="font-medium">Akses ditolak. Hanya untuk DOSEN.</p>
      </Card>
    );
  }

  useEffect(() => {
    try {
      dashboardDetailJadwal().then((res) => {
        if (res.success && res.data) {
          setDataRole(res.data);
        } else {
          setDataRole([]);
        }
        setDate(new Date());
      });
    } catch (error) {
      console.error("Error fetching jadwal data:", error);
      setDataRole([]);
    }
  }, []);

  const thDosen = {
    head: ["Nama Mahasiswa", "Judul Tugas Akhir", "Tanggal", "Peran", "Status"],
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="h-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Riwayat Ujian</h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {thDosen.head.map((head, index) => (
                    <TableHead key={index}>{head}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataRole.map((item, index) => (
                  <TableRow key={index}>
                    {dataRole &&
                      item.status === "DIJADWALKAN" &&
                      (date ? date : new Date()) >
                        new Date(item.jam.split(" - ")[1]) && (
                        <>
                          <TableCell>
                            <div className="flex flex-row items-center">
                              <div className="w-10 h-10 mr-4">
                                {item.foto ? (
                                  <Image
                                    src={item.foto}
                                    alt={item.namaMahasiswa}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-600">
                                      {item.namaMahasiswa
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span>{item.namaMahasiswa}</span>
                                <span className="text-sm text-muted-foreground">
                                  NIM: {item.nim}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.judulTugasAkhir}</TableCell>
                          <TableCell>
                            {item.tanggal
                              ? format(new Date(item.tanggal), "dd MMMM yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {item.dosenPembimbing === session.user?.name
                              ? "Pembimbing"
                              : item.dosenPenguji1 === session.user?.name ||
                                item.dosenPenguji2 === session.user?.name
                              ? "Penguji"
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-green-600">
                              SELESAI
                            </span>
                          </TableCell>
                        </>
                      )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
