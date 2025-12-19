"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { updateDosenProfileByAdmin } from "@/lib/actions/profile/adminEditDosenProfile";
import { useRouter } from "next/navigation";

interface DosenData {
  id: string;
  name: string | null;
  nim: string | null; // NIP/NIK biasanya disimpan di field nim pada schema auth
  email: string | null;
  image: string | null;
  departemen: string | null;
  telepon: string | null;
  prodi: string | null;
}

interface EditDosenModalProps {
  isOpen: boolean;
  onClose: () => void;
  dosen: DosenData | null;
}

export function EditDosenModal({ isOpen, onClose, dosen }: EditDosenModalProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  // Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: "",
    prodi: "",
    departemen: "",
    telepon: "",
  });

  useEffect(() => {
    if (dosen) {
      setFormData({
        name: dosen.name || "",
        prodi: dosen.prodi || "",
        departemen: dosen.departemen || "Departemen Teknik Elektro dan Informatika",
        telepon: dosen.telepon || "",
      });
      setValidationErrors({});
    }
  }, [dosen]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate name: Tidak boleh kosong, tidak boleh hanya angka, minimal 3 karakter
    if (!formData.name.trim()) {
      errors.name = "Nama lengkap wajib diisi";
    } else if (/^\d+$/.test(formData.name.trim())) {
      errors.name = "Nama tidak boleh hanya berisi angka";
    } else if (!/^[a-zA-Z\s.,'()\- ]+$/.test(formData.name.trim())) {
      errors.name = "Nama mengandung karakter ilegal (gunakan huruf, titik, atau koma)";
    }

    // Validate phone: Format Indonesia
    if (formData.telepon && formData.telepon.trim()) {
      const phoneRegex = /^(\+62|62|0)[8-9][0-9]{7,11}$/;
      if (!phoneRegex.test(formData.telepon.trim())) {
        errors.telepon = "Format nomor tidak valid. Gunakan format 08xxxxxxxxxx";
      }
    }

    // Validate prodi & departemen
    if (!formData.prodi) {
      errors.prodi = "Program studi wajib dipilih";
    }
    if (!formData.departemen.trim()) {
      errors.departemen = "Departemen wajib diisi";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dosen) return;

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("prodi", formData.prodi);
      fd.append("departemen", formData.departemen.trim());
      fd.append("telepon", formData.telepon.trim());

      const result = await updateDosenProfileByAdmin(dosen.id, fd);

      if (result.success) {
        setShowSuccessDialog(true);
        router.refresh();
      } else {
        setErrorMessage(result.error || "Gagal memperbarui data dosen.");
        setShowErrorDialog(true);
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
      setShowErrorDialog(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: "" });
    }
  };

  if (!dosen) return null;

  return (
    <>
      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <AlertDialogTitle>Berhasil!</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Data profil dosen telah berhasil diperbarui di sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => { setShowSuccessDialog(false); onClose(); }}>
              Selesai
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle>Gagal Menyimpan</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              Perbaiki Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Edit Data Dosen
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <Avatar className="h-16 w-16 rounded-full border">
                <AvatarImage src={dosen.image || ""} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                  {dosen.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-slate-900">{dosen.email}</p>
                <p className="text-xs text-slate-500 text-pretty">
                  NIP: {dosen.nim || "Belum diatur"}
                </p>
              </div>
            </div>

            {/* Validation Alert Summary */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold">Mohon periksa kembali input Anda:</p>
                  <ul className="list-disc list-inside text-xs mt-1">
                    {Object.values(validationErrors).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="d-name">Nama Lengkap & Gelar <span className="text-red-500">*</span></Label>
                <Input
                  id="d-name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className={validationErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                  placeholder="Contoh: Dr. Ir. Nama Dosen, M.T."
                />
                {validationErrors.name && <p className="text-xs text-red-500 font-medium">{validationErrors.name}</p>}
              </div>

              {/* Prodi */}
              <div className="space-y-2">
                <Label htmlFor="d-prodi">Program Studi <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.prodi}
                  onValueChange={(val) => handleFieldChange("prodi", val)}
                >
                  <SelectTrigger className={validationErrors.prodi ? "border-red-500" : ""}>
                    <SelectValue placeholder="Pilih prodi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TeknologiRekayasaPerangkatLunak">Teknologi Rekayasa Perangkat Lunak</SelectItem>
                    <SelectItem value="TeknologiRekayasaElektro">Teknologi Rekayasa Elektro</SelectItem>
                    <SelectItem value="TeknologiRekayasaInternet">Teknologi Rekayasa Internet</SelectItem>
                    <SelectItem value="TeknologiRekayasaInstrumentasiDanKontrol">Teknologi Rekayasa Instrumentasi Dan Kontrol</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.prodi && <p className="text-xs text-red-500">{validationErrors.prodi}</p>}
              </div>

              {/* Telepon */}
              <div className="space-y-2">
                <Label htmlFor="d-telepon">No. WhatsApp/Telepon</Label>
                <Input
                  id="d-telepon"
                  value={formData.telepon}
                  onChange={(e) => handleFieldChange("telepon", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={validationErrors.telepon ? "border-red-500" : ""}
                />
                {validationErrors.telepon && <p className="text-xs text-red-500">{validationErrors.telepon}</p>}
              </div>

              {/* Departemen */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="d-dept">Departemen <span className="text-red-500">*</span></Label>
                <Input
                  id="d-dept"
                  value={formData.departemen}
                  onChange={(e) => handleFieldChange("departemen", e.target.value)}
                  className={validationErrors.departemen ? "border-red-500" : ""}
                />
                {validationErrors.departemen && <p className="text-xs text-red-500">{validationErrors.departemen}</p>}
              </div>
            </div>

            <DialogFooter className="pt-4 border-t gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button type="submit" className="min-w-[120px]" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}