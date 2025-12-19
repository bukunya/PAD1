"use client";

import { useFormStatus } from "react-dom";
import {
  submitBerkas,
  type FormState,
} from "@/lib/actions/formPengajuan/uploadBerkasSupabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState, useEffect, useState } from "react";
import { DataProfile } from "@/lib/actions/formPengajuan/dataProfile";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, CheckCircle, FileUp, Loader2, XCircle, Lock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileErrorModal } from "./fp-errormodal";

interface UserProfile {
  id: string;
  name: string | null;
  nim: string | null;
  prodi: string | null;
  departemen: string | null;
  dosenPembimbingId: string | null; 
  dosenPembimbing: string | null;
  hasActiveSubmission?: boolean;
  submissionStatus?: string;
}

function SubmitButton({ hasFile, disabled }: { hasFile: boolean; disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending || disabled || !hasFile} 
      className="px-6"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Mengunggah...
        </>
      ) : (
        "Submit"
      )}
    </Button>
  );
}

export default function FpBottom() {
  const router = useRouter();
  const initialState: FormState = { success: false, message: "" };
  const [state, formAction] = useActionState(submitBerkas, initialState);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showFileErrorModal, setShowFileErrorModal] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await DataProfile();
        if (result.success && result.data) {
          setUserData(result.data as UserProfile);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    if (state.message) {
      if (state.success) setShowSuccessDialog(true);
      else setShowErrorDialog(true);
    }
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setFileErrorMessage("File yang Anda upload bukan format PDF. Silakan upload file dengan format PDF.");
        setShowFileErrorModal(true);
        e.target.value = "";
        setSelectedFile(null);
        return;
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
        setFileErrorMessage(`Ukuran file terlalu besar (${fileSizeMB} MB). Maksimal ukuran file adalah 10 MB.`);
        setShowFileErrorModal(true);
        e.target.value = "";
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  if (isLoadingProfile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const hasActive = !!userData?.hasActiveSubmission;
  const noPembimbing = !userData?.dosenPembimbingId;
  const isDisabled = noPembimbing || hasActive;

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
      DITERIMA: "Diterima",
      DITOLAK: "Ditolak",
      DIJADWALKAN: "Dijadwalkan",
      SELESAI: "Selesai"
    };
    return statusMap[status] || status;
  };

  return (
    <>
      <FileErrorModal 
        isOpen={showFileErrorModal} 
        onClose={() => setShowFileErrorModal(false)} 
        errorMessage={fileErrorMessage} 
      />

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <AlertDialogTitle>Pengajuan Berhasil!</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              {state.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/dashboard")}>
              Kembali ke Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle>Pengajuan Gagal</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              {state.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              Coba Lagi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Upload Berkas</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Alert - Active Submission */}
            {hasActive && (
              <Alert className="mb-6 border-blue-300 bg-blue-50">
                <Lock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm leading-relaxed">
                  <span className="font-semibold text-blue-900">Form Pengajuan Tidak Tersedia.</span>
                  {" "}Anda memiliki pengajuan aktif dengan status: {" "} 
                  <span className="font-semibold text-blue-700">
                    {getStatusLabel(userData?.submissionStatus || "")}
                  </span>
                </AlertDescription>
              </Alert>
            )}

            {/* Alert - No Pembimbing */}
            {noPembimbing && !hasActive && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm leading-relaxed">
                  <span className="font-semibold">Dosen pembimbing belum ditentukan.</span>
                  {" "}Silakan lengkapi profil Anda terlebih dahulu.{" "}
                  <button 
                    onClick={() => router.push("/profile")}
                    className="underline font-medium hover:no-underline"
                  >
                    Lengkapi Profil →
                  </button>
                </AlertDescription>
              </Alert>
            )}

            <form action={formAction} className="space-y-6">
              <input type="hidden" name="dosenPembimbingId" value={userData?.dosenPembimbingId || ""} />
              <input type="hidden" name="dosenPembimbingName" value={userData?.dosenPembimbing || ""} />

              <div className="space-y-2">
                <Label htmlFor="judul" className="text-sm font-medium">
                  Judul Tugas Akhir
                </Label>
                <Input 
                  id="judul" 
                  name="judul" 
                  type="text"
                  required 
                  placeholder="Masukkan Judul Tugas Akhir" 
                  disabled={isDisabled}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosenPembimbingName" className="text-sm font-medium">
                  Dosen Pembimbing
                </Label>
                <Input 
                  id="dosenPembimbingName"
                  value={userData?.dosenPembimbing || "Tidak ada data"} 
                  disabled 
                  className="bg-gray-50 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="berkas" className="text-sm font-medium">
                  Upload Berkas
                </Label>
                <div className="flex items-center gap-4">
                  <label 
                    htmlFor="berkas" 
                    className={`flex items-center gap-2 px-4 py-3 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg transition-colors ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-100"
                    }`}
                  >
                    <FileUp className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-600 font-medium">
                      {selectedFile ? selectedFile.name : "Upload Files"}
                    </span>
                  </label>
                  {!selectedFile && <span className="text-sm text-gray-500">PDF (Max 10MB)</span>}
                </div>
                <Input 
                  id="berkas" 
                  name="berkas" 
                  type="file" 
                  accept=".pdf,application/pdf" 
                  required 
                  onChange={handleFileChange} 
                  className="hidden" 
                  disabled={isDisabled} 
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">
                    File terpilih: <span className="font-medium">{selectedFile.name}</span>{" "}
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <SubmitButton hasFile={!!selectedFile} disabled={isDisabled} />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}