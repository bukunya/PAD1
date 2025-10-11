"use client";

interface MahasiswaData {
  nama: string;
  nimId: string;
  angkatan: string;
  jurusan: string;
  nimIdMahasiswa: string;
  semester: string;
  judulTugasAkhir: string;
}

interface DataMahasiswaFormProps {
  mahasiswaData: MahasiswaData;
  onMahasiswaChange: (field: keyof MahasiswaData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function DataMahasiswaForm({ mahasiswaData, onMahasiswaChange }: DataMahasiswaFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Data Mahasiswa</h2>
      
      {/* Tabel 3x3 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Baris 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Nama
          </label>
          <input
            type="text"
            value={mahasiswaData.nama}
            onChange={onMahasiswaChange('nama')}
            placeholder="Isikan nama lengkap"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            NIM / ID Mahasiswa
          </label>
          <input
            type="text"
            value={mahasiswaData.nimId}
            onChange={onMahasiswaChange('nimId')}
            placeholder="Isikan NIM atau ID Mahasiswa"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Angkatan
          </label>
          <input
            type="text"
            value={mahasiswaData.angkatan}
            onChange={onMahasiswaChange('angkatan')}
            placeholder="Isikan angkatan (tahun masuk)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Baris 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Jurusan
          </label>
          <input
            type="text"
            value={mahasiswaData.jurusan}
            onChange={onMahasiswaChange('jurusan')}
            placeholder="Isikan nama fakultas/sekolah"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            NIM / ID Mahasiswa
          </label>
          <input
            type="text"
            value={mahasiswaData.nimIdMahasiswa}
            onChange={onMahasiswaChange('nimIdMahasiswa')}
            placeholder="Isikan jurusan/program studi"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Semester
          </label>
          <input
            type="text"
            value={mahasiswaData.semester}
            onChange={onMahasiswaChange('semester')}
            placeholder="Isikan semester saat ini"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Baris 3 - Merged Column untuk Judul Tugas Akhir */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Judul Tugas Akhir
          </label>
          <textarea
            value={mahasiswaData.judulTugasAkhir}
            onChange={onMahasiswaChange('judulTugasAkhir')}
            placeholder="Isikan judul tugas akhir"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            required
          />
        </div>
      </div>
    </div>
  );
}

export type { MahasiswaData };