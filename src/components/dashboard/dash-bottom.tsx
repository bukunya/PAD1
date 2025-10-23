import { th } from "date-fns/locale";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../ui/table";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { dashboardDetailJadwal } from "@/lib/actions/dashboardDetailJadwal";

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

const dataMhs = [
  {
    judul: "Analisis Sistem Informasi Akademik",
    jenis: "Ujian Proposal",
    tanggal: "2024-06-15",
    jam: "10:00 - 12:00",
    id: 1,
  },
  {
    judul: "Pengembangan Aplikasi Mobile untuk E-Learning",
    jenis: "Ujian Skripsi",
    tanggal: "2024-06-20",
    jam: "13:00 - 15:00",
    id: 2,
  },
];

function DashboardBottom() {
  const { data: session, status } = useSession();
  const [dataRole, setDataRole] = useState<any[]>([]);
  const [tableHead, setTableHead] = useState<{ head: string[] }>({ head: [] });
  if (status === "loading" || !session) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="font-medium">Mengambil Data...</p>
      </Card>
    );
  }
  const role = session.user?.role;
  useEffect(() => {
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
  }, []);

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
                    <TableCell>
                      {item.jam
                        ? format(new Date(item.jam.split(" - ")[0]), "HH:mm") +
                          " - " +
                          format(new Date(item.jam.split(" - ")[1]), "HH:mm")
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
                    <TableCell>
                      {item.jam
                        ? format(new Date(item.jam.split(" - ")[0]), "HH:mm") +
                          " - " +
                          format(new Date(item.jam.split(" - ")[1]), "HH:mm")
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
