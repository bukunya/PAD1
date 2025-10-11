"use client";

import { useState } from 'react';
import { Save } from 'lucide-react';
import DataMahasiswaForm, { type MahasiswaData } from './DataMahasiswaForm';
import UploadBerkasForm, { type UploadData } from './UploadBerkasForm';

// Initial empty data
const INITIAL_MAHASISWA_DATA: MahasiswaData = {
  nama: '',
  nimId: '',
  angkatan: '',
  jurusan: '',
  nimIdMahasiswa: '',
  semester: '',
  judulTugasAkhir: ''
};

const INITIAL_UPLOAD_DATA: UploadData = {
  jenisUjian: 'ujian-tugas-akhir' as const
};

export default function FormPengajuan() {
  const [mahasiswaData, setMahasiswaData] = useState(INITIAL_MAHASISWA_DATA);
  const [uploadData, setUploadData] = useState(INITIAL_UPLOAD_DATA);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleMahasiswaChange = (field: keyof MahasiswaData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMahasiswaData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleJenisUjianChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUploadData(prev => ({
      ...prev,
      jenisUjian: e.target.value as typeof prev.jenisUjian
    }));
  };

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/pdf') {
      setUploadedFile(file);
    } else {
      alert('Hanya file PDF yang diperbolehkan');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Validate mahasiswa data
    if (!mahasiswaData.nama.trim()) newErrors.push('Nama harus diisi');
    if (!mahasiswaData.nimId.trim()) newErrors.push('NIM/ID harus diisi');
    if (!mahasiswaData.angkatan.trim()) newErrors.push('Angkatan harus diisi');
    if (!mahasiswaData.jurusan.trim()) newErrors.push('Jurusan harus diisi');
    if (!mahasiswaData.nimIdMahasiswa.trim()) newErrors.push('NIM/ID Mahasiswa (baris 2) harus diisi');
    if (!mahasiswaData.semester.trim()) newErrors.push('Semester harus diisi');
    if (!mahasiswaData.judulTugasAkhir.trim()) newErrors.push('Judul Tugas Akhir harus diisi');

    // Validate upload berkas
    if (!uploadedFile) newErrors.push('File berkas harus diupload');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement API call to submit form
      console.log('Submitting form data:', {
        mahasiswaData,
        uploadData,
        file: uploadedFile
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful submission
      setMahasiswaData(INITIAL_MAHASISWA_DATA);
      setUploadData(INITIAL_UPLOAD_DATA);
      setUploadedFile(null);
      
      alert('Pengajuan berhasil dikirim!');
      
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Gagal mengirim pengajuan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Form Pengajuan</h1>
          <p className="text-gray-600">Lengkapi data di bawah ini untuk mengajukan ujian tugas akhir</p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-medium mb-2">Mohon lengkapi data berikut:</h3>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Data Mahasiswa Section */}
        <DataMahasiswaForm 
          mahasiswaData={mahasiswaData}
          onMahasiswaChange={handleMahasiswaChange}
        />

        {/* Upload Berkas Section */}
        <UploadBerkasForm
          uploadData={uploadData}
          uploadedFile={uploadedFile}
          isDragOver={isDragOver}
          onJenisUjianChange={handleJenisUjianChange}
          onFileSelect={handleFileSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemoveFile={removeFile}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Save size={20} />
                Submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}