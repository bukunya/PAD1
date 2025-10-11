export interface MahasiswaData {
  nama: string;
  nimId: string;
  angkatan: string;
  jurusan: string;
  nimIdMahasiswa: string; // baris 2 kolom 2
  semester: string;
  judulTugasAkhir: string; // merged baris 3
}

export interface UploadBerkas {
  jenisUjian: 'ujian-tugas-akhir' | 'seminar-hasil' | 'komprehensif';
  berkasFile?: File;
}

export interface FormPengajuanData {
  mahasiswaData: MahasiswaData;
  uploadBerkas: UploadBerkas;
}