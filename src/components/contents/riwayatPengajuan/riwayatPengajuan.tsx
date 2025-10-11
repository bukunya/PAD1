"use client";

import { useState } from 'react';
import { Bell, Calendar, CheckCircle, Clock, AlertCircle, XCircle, FileX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Expanded dummy data dengan contoh ditolak
const DUMMY_RIWAYAT = [
  {
    id: 1,
    tanggal: '25 Agustus 2025',
    status: 'completed',
    judul: 'Pengajuan telah dibuat dan disubmit pada sistem',
    waktu: '1 week ago',
    tipe: 'submit',
    detail: 'Dokumen pengajuan ujian tugas akhir berhasil diupload ke sistem'
  },
  {
    id: 2,
    tanggal: '27 Agustus 2025',
    status: 'rejected',
    judul: 'Pengajuan ditolak oleh Admin Prodi',
    waktu: '5 days ago',
    tipe: 'rejection',
    detail: 'Dokumen tidak lengkap: Transkrip nilai belum dilampirkan, Format judul tidak sesuai pedoman',
    alasan: 'Dokumen tidak lengkap'
  },
  {
    id: 3,
    tanggal: '01 September 2025',
    status: 'completed',
    judul: 'Pengajuan revisi telah disubmit pada sistem',
    waktu: '2 days ago',
    tipe: 'resubmit',
    detail: 'Dokumen yang diperbaiki telah diupload kembali'
  },
  {
    id: 4,
    tanggal: '03 September 2025',
    status: 'completed',
    judul: 'Pengajuan anda telah diverifikasi oleh pihak Admin Prodi',
    waktu: '12 hours ago',
    tipe: 'verification',
    detail: 'Semua dokumen telah diperiksa dan memenuhi persyaratan'
  },
  {
    id: 5,
    tanggal: '10 September 2025',
    status: 'in-progress',
    judul: 'Menunggu penjadwalan ujian oleh pihak Admin Prodi',
    waktu: '2 hours ago',
    tipe: 'scheduling',
    detail: 'Sedang menunggu koordinasi jadwal dengan dosen penguji'
  }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'in-progress', label: 'Diproses' },
  { value: 'completed', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' }
];

export default function RiwayatPengajuan() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'; // Green
      case 'in-progress':
        return 'secondary'; // Blue
      case 'pending':
        return 'outline'; // Yellow
      case 'rejected':
        return 'destructive'; // Red
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (tipe: string) => {
    switch (tipe) {
      case 'submit':
        return <Bell className="w-4 h-4" />;
      case 'resubmit':
        return <Bell className="w-4 h-4" />;
      case 'verification':
        return <CheckCircle className="w-4 h-4" />;
      case 'scheduling':
        return <Clock className="w-4 h-4" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'rejection':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusIconBg = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'in-progress':
        return 'bg-blue-100 text-blue-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'rejected':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredRiwayat = selectedStatus === 'all' 
    ? DUMMY_RIWAYAT 
    : DUMMY_RIWAYAT.filter(item => item.status === selectedStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Riwayat Pengajuan</h1>
            
            {/* Filter Dropdown */}
            <div className="flex items-center gap-4">
              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Semua Peran Dropdown (placeholder) */}
              <Select defaultValue="all-roles">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Semua Peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-roles">Semua Peran</SelectItem>
                  <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                  <SelectItem value="admin">Admin Prodi</SelectItem>
                  <SelectItem value="dosen">Dosen Penguji</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <Card>
          <CardContent className="p-6">
            {filteredRiwayat.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileX className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada riwayat</h3>
                <p className="text-gray-600">Belum ada riwayat pengajuan dengan filter yang dipilih.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRiwayat.map((item, index) => (
                  <div key={item.id} className="relative flex gap-6">
                    {/* Timeline Icon */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusIconBg(item.status)}`}>
                        {getStatusIcon(item.tipe)}
                      </div>
                      
                      {/* Timeline Line */}
                      {index !== filteredRiwayat.length - 1 && (
                        <div className="absolute top-10 left-1/2 w-0.5 h-8 bg-gray-200 transform -translate-x-1/2"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Date */}
                      <div className="flex items-center gap-3 mb-2">
                        <time className="text-lg font-semibold text-gray-900">
                          {item.tanggal}
                        </time>
                        <span className="text-sm text-gray-500">{item.waktu}</span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-medium text-gray-900 mb-2">
                        {item.judul}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                        {item.detail}
                      </p>

                      {/* Rejection Reason (khusus untuk status ditolak) */}
                      {item.status === 'rejected' && item.alasan && (
                        <Alert className="mb-3 border-red-200 bg-red-50">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            <strong>Alasan Penolakan:</strong> {item.alasan}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(item.status)} className="text-xs">
                          {item.status === 'completed' && 'Selesai'}
                          {item.status === 'in-progress' && 'Diproses'}
                          {item.status === 'pending' && 'Menunggu'}
                          {item.status === 'rejected' && 'Ditolak'}
                        </Badge>

                        {/* Action Button for rejected items */}
                        {item.status === 'rejected' && (
                          <Button variant="outline" size="sm" className="text-xs">
                            Ajukan Ulang
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info Card
        <Alert className="mt-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong className="block mb-2">Informasi Penting:</strong>
            <ul className="text-sm space-y-1">
              <li>• Pastikan untuk memantau status pengajuan secara berkala</li>
              <li>• Hubungi Admin Prodi jika ada keterlambatan proses lebih dari 7 hari</li>
              <li>• Notifikasi akan dikirim via email untuk setiap perubahan status</li>
              <li>• Untuk pengajuan yang ditolak, Anda dapat mengajukan ulang setelah memperbaiki dokumen</li>
            </ul>
          </AlertDescription>
        </Alert> */}
      </div>
    </div>
  );
}