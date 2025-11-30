// src/components/pengajuan/pengajuan-modal-verify.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  FileText,
} from "lucide-react";
import {
  getUjianForReview,
  acceptUjian,
  rejectUjian,
} from "@/lib/actions/adminAssignUjian/adminTerimaTolakUjian";
import { useRouter } from "next/navigation";

interface PengajuanData {
  mahasiswa: {
    name: string | null;
    nim: string | null;
    prodi?: string | null;
  };
  judul: string;
  berkasUrl?: string;
  status: string;
}

interface PengajuanModalVerifyProps {
  pengajuanId: string;
  onClose: () => void;
}

export function PengajuanModalVerify({
  pengajuanId,
  onClose,
}: PengajuanModalVerifyProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<PengajuanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [komentarAdmin, setKomentarAdmin] = useState("");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getUjianForReview(pengajuanId);

        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.error || "Gagal memuat data");
        }
      } catch {
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [pengajuanId]);

  const handleAccept = async () => {
    setIsProcessing(true);
    setMessage(null);

    try {
      const result = await acceptUjian(pengajuanId);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Pengajuan diterima",
        });

        setTimeout(() => {
          router.refresh();
          onClose();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Gagal menerima pengajuan",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat menerima pengajuan",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    setMessage(null);

    try {
      const result = await rejectUjian(pengajuanId, komentarAdmin);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Pengajuan ditolak",
        });

        setTimeout(() => {
          router.refresh();
          onClose();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Gagal menolak pengajuan",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat menolak pengajuan",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pengajuan Mahasiswa
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {/* Status Message */}
            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {/* Mahasiswa Info */}
            <div className="p-4 bg-blue-50 rounded-lg space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Nama Mahasiswa
              </h3>
              <p className="text-lg font-bold">{data?.mahasiswa.name}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">NIM/ ID Mahasiswa</p>
                  <p className="font-medium">{data?.mahasiswa.nim}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Jurusan</p>
                  <p className="font-medium">
                    {data?.mahasiswa.prodi || "Teknik Informatika"}
                  </p>
                </div>
              </div>
            </div>

            {/* Judul TA */}
            <div>
              <Label className="text-muted-foreground text-sm">
                Judul Tugas Akhir
              </Label>
              <p className="mt-2 text-base font-medium">{data?.judul}</p>
            </div>

            {/* Berkas */}
            <div>
              <Label className="text-muted-foreground text-sm">Berkas</Label>
              <div className="mt-2 p-4 border rounded-lg flex items-center justify-between bg-blue-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-500 rounded flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {data?.berkasUrl
                        ? data.berkasUrl.split("/").pop()
                        : "Tidak ada berkas"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={data?.berkasUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Reject Form (Conditional) */}
            {showRejectForm && (
              <div>
                <Label htmlFor="komentar">
                  Komentar / Alasan Penolakan (Opsional)
                </Label>
                <textarea
                  id="komentar"
                  value={komentarAdmin}
                  onChange={(e) => setKomentarAdmin(e.target.value)}
                  placeholder="Masukkan alasan penolakan..."
                  rows={4}
                  disabled={isProcessing}
                  className="mt-2 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!showRejectForm ? (
                <>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={handleAccept}
                    disabled={
                      isProcessing || data?.status !== "MENUNGGU_VERIFIKASI"
                    }
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verifikasi
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setShowRejectForm(true)}
                    disabled={
                      isProcessing || data?.status !== "MENUNGGU_VERIFIKASI"
                    }
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Ditolak
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleReject}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Konfirmasi Penolakan
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowRejectForm(false);
                      setKomentarAdmin("");
                    }}
                    disabled={isProcessing}
                  >
                    Batal
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
