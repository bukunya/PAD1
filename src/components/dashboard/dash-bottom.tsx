import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { dashboardDetailJadwal } from "@/lib/actions/dashboardDetailJadwal";

interface JadwalItem {
  idUjian?: string;
  namaMahasiswa?: string | null;
  nim?: string | null;
  foto?: string | null;
  judulTugasAkhir?: string | null;
  jenisUjian?: string;
  tanggal?: Date | null;
  jam?: string | null;
  ruangan?: string | null;
  dosenPembimbing?: string | null;
  dosenPenguji1?: string | null;
  dosenPenguji2?: string | null;
  status?: string;
}

const thDsn = {
  head: [
    "Nama Mahasiswa",
    "Judul Tugas Akhir",
    "Tanggal",
    "Jam",
    "Ruangan",
    "Peran",
    "Aksi",
  ],
};

const thMhs = {
  head: ["Judul Tugas Akhir", "Jenis Ujian", "Tanggal", "Jam", "Aksi"],
};

const thAdm = {
  head: [
    "Nama Mahasiswa",
    "Tanggal Ujian",
    "Ruang Ujian",
    "Penguji 1",
    "Penguji 2",
    "Pembimbing",
  ],
};

function DashboardBottom() {
  const { data: session, status } = useSession();
  const [dataRole, setDataRole] = useState<JadwalItem[]>([]);
  const [tableHead, setTableHead] = useState<{ head: string[] }>({ head: [] });
  const role = session?.user?.role;

  useEffect(() => {
    if (!session || !role) return;
    try {
      dashboardDetailJadwal().then((res) => {
        if (res.success && res.data) {
          setDataRole(res.data);
        } else {
          setDataRole([]);
        }
        if (role === "MAHASISWA") {
          setTableHead(thMhs);
        } else if (role === "DOSEN") {
          setTableHead(thDsn);
        } else if (role === "ADMIN") {
          setTableHead(thAdm);
        } else {
          setTableHead({ head: [] });
        }
      });
    } catch (error) {
      console.error("Error fetching jadwal data:", error);
      setDataRole([]);
    }
  }, [session, role]);

  if (status === "loading" || !session) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="font-medium">Mengambil Data...</p>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-lg font-semibold">Detail Jadwal</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {tableHead.head.map((head, index) => (
                <TableHead key={index}>{head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataRole.map((item, index) => (
              <TableRow key={index}>
                {role === "MAHASISWA" && (
                  <>
                    <TableCell>{item.judulTugasAkhir}</TableCell>
                    <TableCell>{item.jenisUjian || "N/A"}</TableCell>
                    <TableCell>
                      {item.tanggal
                        ? format(new Date(item.tanggal), "dd/MM/yyyy")
                        : "N/A"}
                    </TableCell>
                    {/* jam */}
                    <TableCell>
                      {item.tanggal
                        ? format(new Date(item.tanggal), "HH:mm:ss")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:underline">
                        Lihat Detail
                      </button>
                    </TableCell>
                  </>
                )}
                {role === "DOSEN" && item.status === "DIJADWALKAN" && (
                  <>
                    <TableCell>{item.namaMahasiswa}</TableCell>
                    <TableCell>{item.judulTugasAkhir}</TableCell>
                    <TableCell>
                      {item.tanggal
                        ? format(new Date(item.tanggal), "dd/MM/yyyy")
                        : "N/A"}
                    </TableCell>
                    {/* Jam */}
                    <TableCell>
                      {item.tanggal
                        ? format(new Date(item.tanggal), "HH:mm:ss")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{item.ruangan}</TableCell>
                    <TableCell>
                      {item.dosenPembimbing === session.user?.name
                        ? "Pembimbing"
                        : "Penguji"}
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:underline">
                        Lihat Detail
                      </button>
                    </TableCell>
                  </>
                )}
                {role === "ADMIN" && (
                  <>
                    <TableCell>{item.namaMahasiswa}</TableCell>
                    <TableCell>
                      {item.tanggal
                        ? format(new Date(item.tanggal), "dd/MM/yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{item.ruangan}</TableCell>
                    <TableCell>{item.dosenPenguji1 || "N/A"}</TableCell>
                    <TableCell>{item.dosenPenguji2 || "N/A"}</TableCell>
                    <TableCell className="border">
                      {item.dosenPembimbing || "N/A"}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default DashboardBottom;
