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
import { statistics } from "@/lib/actions/statistics";
import Image from "next/image";

export default function Page() {
  const { data: session, status } = useSession();
  const [mhsData, setMhsData] = useState<any[]>([]);

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

  useEffect(() => {
    try {
      statistics().then((res) => {
        if (res.success && res.data) {
          setMhsData(res.data.mahasiswa);
        } else {
          setMhsData([]);
        }
      });
    } catch (error) {
      console.error("Error fetching jadwal data:", error);
      setMhsData([]);
    }
  }, []);

  const thMhs = {
    head: ["Nama Mahasiswa", "Angkatan", "Program Studi", "Status", "Aksi"],
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="h-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Data Mahasiswa</h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {thMhs.head.map((head, index) => (
                    <TableHead key={index}>{head}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mhsData.map((item, index) => (
                  <TableRow key={index}>
                    {mhsData.length > 0 ? (
                      <>
                        <TableCell>
                          <div className="flex flex-row items-center">
                            <div className="w-10 h-10 mr-4">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-600">
                                    {item.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span>{item.name}</span>
                              <span className="text-sm text-muted-foreground">
                                NIM: {item.nim}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.nim ? item.nim.slice(0, 2) : "N/A"}
                        </TableCell>
                        <TableCell>{item.prodi}</TableCell>
                        <TableCell>
                          <span>Aktif</span>
                        </TableCell>
                        <TableCell>
                          {/* Placeholder for actions, e.g., View Details button */}
                          <button className="text-blue-600 hover:underline">
                            Lihat Detail
                          </button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell
                          colSpan={thMhs.head.length}
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
