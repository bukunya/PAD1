export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'mahasiswa' | 'dosen' | 'admin';
}

export interface StatusCard {
  title: string;
  value: string;
  icon: string;
  bgColor: string;
}

export interface StatusPengajuan {
  id: string;
  tanggal: string;
  status: 'pending' | 'approved' | 'rejected';
  deskripsi: string;
  createdAt: Date;
}

export interface JadwalUjian {
  id: string;
  judulTugasAkhir: string;
  jenisUjian: string;
  tanggal: string;
  jam: string;
  ruangan?: string;
  dosenPembimbing?: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  waktu: string;
  ruangan: string;
  date: Date;
}