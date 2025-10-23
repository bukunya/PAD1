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
    const formattedData = dataArray.map((item: any) => ({
      idUjian: item.id,
      namaMahasiswa: item.mahasiswa?.name || null,
      nim: item.mahasiswa?.nim || null,
      foto: item.mahasiswa?.image || null,
      judulTugasAkhir: item.judul || null,
      tanggal: item.tanggalUjian,
      jam: `${item.jamMulai} - ${item.jamSelesai}`,
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
