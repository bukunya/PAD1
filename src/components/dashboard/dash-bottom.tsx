import { th } from "date-fns/locale";
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
    "Pembimbing 1",
    "Pembimbing 2",
    "Penguji",
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

const dataDsn = [
  {
    nama: "Budi Santoso",
    judul: "Analisis Sistem Informasi Akademik",
    tanggal: "2024-06-15",
    jam: "10:00 - 12:00",
    ruangan: "Ruang 101",
    peran: "Pembimbing 1",
    id: 3,
  },
  {
    nama: "Siti Aminah",
    judul: "Pengembangan Aplikasi Mobile untuk E-Learning",
    tanggal: "2024-06-20",
    jam: "13:00 - 15:00",
    ruangan: "Ruang 102",
    peran: "Pembimbing 2",
    id: 4,
  },
];

const dataAdm = [
  {
    nama: "Budi Santoso",
    tanggal: "2024-06-15",
    ruangan: "Ruang 101",
    pembimbing1: "Dr. Andi Wijaya",
    pembimbing2: "Dr. Siti Rahma",
    penguji: "Dr. Rina Lestari",
    id: 5,
  },
  {
    nama: "Siti Aminah",
    tanggal: "2024-06-20",
    ruangan: "Ruang 102",
    pembimbing1: "Dr. Andi Wijaya",
    pembimbing2: "Dr. Siti Rahma",
    penguji: "Dr. Rina Lestari",
    id: 6,
  },
];

function DashboardBottom() {
  const { data: session, status } = useSession();
  //   const status = "loading";
  if (status === "loading" || !session) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="font-medium">Mengambil Data...</p>
      </Card>
    );
  }
  const role = session.user?.role;
  let tableHead;
  let data;
  if (role === "MAHASISWA") {
    tableHead = thMhs;
    data = dataMhs;
  } else if (role === "DOSEN") {
    tableHead = thDsn;
    data = dataDsn;
  } else if (role === "ADMIN") {
    tableHead = thAdm;
    data = dataAdm;
  } else {
    tableHead = thMhs;
    data = dataMhs;
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
            {data.map((item, index) => (
              <TableRow key={index}>
                {Object.values(item).map((value, i) => (
                  <TableCell key={i}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default DashboardBottom;
