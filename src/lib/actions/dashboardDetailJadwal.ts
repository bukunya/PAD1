// a.	Id ujian
// b.	Nama mahasiswa
// c.	Judul tugas akhir
// d.	Tanggal
// e.	Jam
// f.	Ruangan
// g.	Dosen penguji 1
// h.	Dosen penguji 2
// i.	Dosen pembimbing

"use server";

import { dataRoleSpecific } from "./dataRoleSpecific";
import type { Ujian, User } from "../../generated/prisma";

interface UjianWithIncludes extends Ujian {
  mahasiswa: User | null;
  dosenPembimbing: User | null;
  dosenPenguji: {
    dosen: User;
  }[];
}

export async function dashboardDetailJadwal() {
  try {
    const res = await dataRoleSpecific();

    if (!res.success) {
      return {
        success: false,
        error: res.error || "Failed to fetch data",
      };
    }

    // Handle both single object (admin) and array (non-admin) from dataRoleSpecific
    const dataArray = Array.isArray(res.data)
      ? res.data
      : res.data
      ? [res.data]
      : [];

    // Format data to return only the fields mentioned above on line 1-9
    const formattedData = dataArray.map((item: UjianWithIncludes) => ({
      idUjian: item.id,
      namaMahasiswa: item.mahasiswa?.name || null,
      nim: item.mahasiswa?.nim || null,
      foto: item.mahasiswa?.image || null,
      judulTugasAkhir: item.judul || null,
      tanggal: item.tanggalUjian,
      jam: item.jamMulai && item.jamSelesai ? `${item.jamMulai.toISOString().split('T')[1].substring(0, 5)} - ${item.jamSelesai.toISOString().split('T')[1].substring(0, 5)}` : null,
      ruangan: item.ruangan,
      dosenPenguji1: item.dosenPenguji?.[0]?.dosen?.name || null,
      dosenPenguji2: item.dosenPenguji?.[1]?.dosen?.name || null,
      dosenPembimbing: item.dosenPembimbing?.name || null,
      status: item.status || null,
    }));

    return {
      success: true,
      data: formattedData,
    };
  } catch (error) {
    console.error("Unexpected error in dashboardDetailJadwal:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat memproses data jadwal",
    };
  }
}
