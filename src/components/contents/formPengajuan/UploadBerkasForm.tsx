"use client";

import { Upload, FileText, X } from 'lucide-react';

interface UploadData {
  jenisUjian: 'ujian-tugas-akhir' | 'seminar-hasil' | 'komprehensif';
}

interface UploadBerkasFormProps {
  uploadData: UploadData;
  uploadedFile: File | null;
  isDragOver: boolean;
  onJenisUjianChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFileSelect: (file: File) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemoveFile: () => void;
}

export default function UploadBerkasForm({
  uploadData,
  uploadedFile,
  isDragOver,
  onJenisUjianChange,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemoveFile
}: UploadBerkasFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Berkas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Berkas */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Upload Berkas
          </label>
          
          {!uploadedFile ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Upload Files</p>
              <p className="text-xs text-gray-400">PDF</p>
              
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={onRemoveFile}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export type { UploadData };