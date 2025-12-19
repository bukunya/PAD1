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
import { updateMahasiswaProfileByAdmin } from "@/lib/actions/profile/adminEditMahasiswaProfile";
import { useRouter } from "next/navigation";
import { RoleChangeConfirmationModal } from "./dm-rolechangemodal";

interface MahasiswaData {
  id: string;
  name: string | null;
  nim: string | null;
  email: string | null;
  image: string | null;
  role: "MAHASISWA" | "DOSEN";
  prodi: string | null;
  telepon: string | null;
  dosenPembimbingId: string | null;
}

interface EditMahasiswaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mahasiswa: MahasiswaData | null;
  dosenList: Array<{ id: string; name: string | null }>;
}

export function EditMahasiswaModal({
  isOpen,
  onClose,
  mahasiswa,
  dosenList,
}: EditMahasiswaModalProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showRoleConfirmation, setShowRoleConfirmation] = useState(false);
  
  // Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: "",
    prodi: "",
    telepon: "",
    role: "MAHASISWA" as "MAHASISWA" | "DOSEN",
    dosenPembimbingId: "",
  });

  useEffect(() => {
    if (mahasiswa) {
      setFormData({
        name: mahasiswa.name || "",
        prodi: mahasiswa.prodi || "",
        telepon: mahasiswa.telepon || "",
        role: mahasiswa.role,
        dosenPembimbingId: mahasiswa.dosenPembimbingId || "",
      });
      // Clear errors when modal opens with new data
      setValidationErrors({});
    }
  }, [mahasiswa]);

  // Validate form before submit
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Nama lengkap wajib diisi";
    } else if (formData.name.length > 100) {
      errors.name = "Nama terlalu panjang (maksimal 100 karakter)";
    }

    // Validate phone
    if (formData.telepon && formData.telepon.trim()) {
      const phoneRegex = /^(\+62|62|0)[8-9][0-9]{7,11}$/;
      if (!phoneRegex.test(formData.telepon.trim())) {
        errors.telepon = "Format nomor telepon tidak valid. Contoh: 08123456789";
      }
    }

    // Validate prodi
    if (!formData.prodi) {
      errors.prodi = "Program studi wajib dipilih";
    }

    // Validate dosen pembimbing for MAHASISWA
    if (formData.role === "MAHASISWA" && !formData.dosenPembimbingId) {
      errors.dosenPembimbingId = "Dosen pembimbing wajib dipilih untuk mahasiswa";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mahasiswa) return;

    // Validate form first
    if (!validateForm()) {
      return;
    }

    // Check if role is changing from MAHASISWA to DOSEN
    if (mahasiswa.role === "MAHASISWA" && formData.role === "DOSEN") {
      setShowRoleConfirmation(true);
      return;
    }

    // If no role change, proceed directly
    await saveChanges();
  };

  const saveChanges = async () => {
    if (!mahasiswa) return;

    setIsSaving(true);
    setValidationErrors({});

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name.trim());
      formDataObj.append("prodi", formData.prodi);
      formDataObj.append("telepon", formData.telepon.trim());
      formDataObj.append("role", formData.role);
      
      // Only send dosenPembimbingId if role is MAHASISWA
      if (formData.role === "MAHASISWA") {
        formDataObj.append("dosenPembimbingId", formData.dosenPembimbingId);
      }

      const result = await updateMahasiswaProfileByAdmin(
        mahasiswa.id,
        formDataObj
      );

      if (result.success) {
        setShowSuccessDialog(true);
        router.refresh();
      } else {
        // Handle field-specific errors
        if (result.fieldErrors) {
          const formattedErrors: Record<string, string> = {};
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              formattedErrors[field] = messages[0];
            }
          });
          setValidationErrors(formattedErrors);
        } else {
          // General error
          setErrorMessage(result.error || "Terjadi kesalahan saat memperbarui data");
          setShowErrorDialog(true);
        }
      }
    } catch (error) {
      console.error("Error updating mahasiswa:", error);
      setErrorMessage("Terjadi kesalahan pada sistem. Silakan coba lagi.");
      setShowErrorDialog(true);
    } finally {
      setIsSaving(false);
      setShowRoleConfirmation(false);
    }
  };

  const handleRoleConfirm = () => {
    saveChanges();
  };

  const handleRoleConfirmClose = () => {
    setShowRoleConfirmation(false);
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    onClose();
  };

  const handleErrorDialogClose = () => {
    setShowErrorDialog(false);
  };

  // Clear validation error when field is modified
  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: "" });
    }
  };

  if (!mahasiswa) return null;

  return (
    <>
      {/* Role Change Confirmation Modal */}
      <RoleChangeConfirmationModal
        isOpen={showRoleConfirmation}
        onClose={handleRoleConfirmClose}
        onConfirm={handleRoleConfirm}
        nama={mahasiswa.name || "User"}
        image={mahasiswa.image}
      />

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
              Data mahasiswa berhasil diperbarui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessDialogClose}>
              OK
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
            <AlertDialogAction onClick={handleErrorDialogClose}>
              Coba Lagi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Edit Modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Data Mahasiswa
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 rounded-full">
                <AvatarImage
                  src={mahasiswa.image || ""}
                  alt={mahasiswa.name || ""}
                />
                <AvatarFallback className="bg-blue-100 text-lg font-semibold text-blue-600">
                  {mahasiswa.name?.charAt(0).toUpperCase() || "M"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-500">Foto Profil</p>
                <p className="text-xs text-gray-400">
                  Foto dikelola melalui akun Google
                </p>
              </div>
            </div>

            {/* General Form Error Alert */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-1">Terdapat kesalahan pada form:</p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, error]) => (
                      <li key={field}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className={validationErrors.name ? "border-red-500" : ""}
                  required
                />
                {validationErrors.name && (
                  <p className="text-xs text-red-600">{validationErrors.name}</p>
                )}
              </div>

              {/* NIM (Disabled) */}
              <div className="space-y-2">
                <Label htmlFor="nim">NIM</Label>
                <Input
                  id="nim"
                  value={mahasiswa.nim || "-"}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  NIM tidak dapat diubah
                </p>
              </div>

              {/* Email (Disabled) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={mahasiswa.email || "-"}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Email tidak dapat diubah
                </p>
              </div>

              {/* Prodi */}
              <div className="space-y-2">
                <Label htmlFor="prodi">
                  Program Studi <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.prodi}
                  onValueChange={(value) => handleFieldChange("prodi", value)}
                >
                  <SelectTrigger className={validationErrors.prodi ? "border-red-500" : ""}>
                    <SelectValue placeholder="Pilih program studi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TeknologiRekayasaPerangkatLunak">
                      Teknologi Rekayasa Perangkat Lunak
                    </SelectItem>
                    <SelectItem value="TeknologiRekayasaElektro">
                      Teknologi Rekayasa Elektro
                    </SelectItem>
                    <SelectItem value="TeknologiRekayasaInternet">
                      Teknologi Rekayasa Internet
                    </SelectItem>
                    <SelectItem value="TeknologiRekayasaInstrumentasiDanKontrol">
                      Teknologi Rekayasa Instrumentasi dan Kontrol
                    </SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.prodi && (
                  <p className="text-xs text-red-600">{validationErrors.prodi}</p>
                )}
              </div>

              {/* Telepon */}
              <div className="space-y-2">
                <Label htmlFor="telepon">No. Telepon</Label>
                <Input
                  id="telepon"
                  value={formData.telepon}
                  onChange={(e) => handleFieldChange("telepon", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={validationErrors.telepon ? "border-red-500" : ""}
                />
                {validationErrors.telepon ? (
                  <p className="text-xs text-red-600">{validationErrors.telepon}</p>
                ) : (
                  <p className="text-xs text-gray-500">Format: 08123456789</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "MAHASISWA" | "DOSEN") =>
                    handleFieldChange("role", value)
                  }
                  disabled={mahasiswa.role === "DOSEN"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAHASISWA">Mahasiswa</SelectItem>
                    <SelectItem value="DOSEN">Dosen</SelectItem>
                  </SelectContent>
                </Select>
                {mahasiswa.role === "MAHASISWA" ? (
                  <p className="text-xs text-amber-600 font-medium">
                    Perubahan role akan mempengaruhi akses sistem user ini
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Role tidak dapat diubah kembali
                  </p>
                )}
              </div>

              {/* Dosen Pembimbing (Only for MAHASISWA) */}
              {formData.role === "MAHASISWA" && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="dosen">
                    Dosen Pembimbing <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.dosenPembimbingId}
                    onValueChange={(value) =>
                      handleFieldChange("dosenPembimbingId", value)
                    }
                  >
                    <SelectTrigger className={validationErrors.dosenPembimbingId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Pilih dosen pembimbing" />
                    </SelectTrigger>
                    <SelectContent>
                      {dosenList.map((dosen) => (
                        <SelectItem key={dosen.id} value={dosen.id}>
                          {dosen.name || "Nama tidak tersedia"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.dosenPembimbingId && (
                    <p className="text-xs text-red-600">{validationErrors.dosenPembimbingId}</p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan
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