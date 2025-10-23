"use client";

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
import { statistics } from "@/lib/actions/statistics";
import Image from "next/image";

interface Dosen {
  id: string;
  name: string | null;
  pembimbingCount: number;
  pengujiCount: number;
  image: string | null;
  nim: string | null;
}

export default function Page() {
  const { data: session, status } = useSession();
  const [dsnData, setDsnData] = useState<Dosen[]>([]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      try {
        statistics().then((res) => {
          if (res.success && res.data) {
            setDsnData(res.data.dosen);
          } else {
            setDsnData([]);
          }
        });
      } catch (error) {
        console.error("Error fetching jadwal data:", error);
        setDsnData([]);
      }
    }
  }, [session]);

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
  if (session.user?.role !== "ADMIN") {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="font-medium">Akses ditolak. Hanya untuk ADMIN.</p>
      </Card>
    );
  }

  const thDsn = {
    head: [
      "Nama Dosen",
      "Jumlah Bimbingan",
      "Jumlah Penguji",
      "Total Beban",
      "Status",
    ],
  };
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="h-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Data Dosen</h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {thDsn.head.map((head, index) => (
                    <TableHead key={index}>{head}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dsnData.map((item, index) => (
                  <TableRow key={index}>
                    {dsnData.length > 0 ? (
                      <>
                        <TableCell>
                          <div className="flex flex-row items-center">
                            <div className="w-10 h-10 mr-4">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name || "Dosen"}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-600">
                                    {item.name
                                      ? item.name
                                          .split(" ")
                                          .map((n: string) => n[0])
                                          .join("")
                                          .toUpperCase()
                                      : "?"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span>{item.name || "N/A"}</span>
                              <span className="text-sm text-muted-foreground">
                                NIM: {item.nim}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.pembimbingCount}</TableCell>
                        <TableCell>{item.pengujiCount}</TableCell>
                        <TableCell>
                          {item.pembimbingCount + item.pengujiCount}
                        </TableCell>
                        <TableCell>Gak Tawu</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell
                          colSpan={thDsn.head.length}
                          className="text-center"
                        >
                          Tidak ada data mahasiswa tersedia.
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
