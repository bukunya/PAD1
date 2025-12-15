"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Loader2, Save, AlertTriangle } from "lucide-react";
import { updateProfile } from "@/lib/actions/profile/profile";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "MAHASISWA" | "DOSEN" | "ADMIN";
  nim: string | null;
  prodi: string | null;
  departemen: string | null;
  telepon: string | null;
  dosenPembimbingId: string | null;
}

interface ProfileClientProps {
  user: UserData;
  dosenList?: Array<{ id: string; name: string | null }>;
}

export function ProfileClient({ user, dosenList = [] }: ProfileClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: user.name || "",
    nim: user.nim || "",
    prodi: user.prodi || "",
    telepon: user.telepon || "",
    dosenPembimbingId: user.dosenPembimbingId || "",
  });

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      MAHASISWA: "Mahasiswa",
      DOSEN: "Dosen",
      ADMIN: "Admin Prodi",
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: Record<string, string> = {
      MAHASISWA: "bg-blue-100 text-blue-700",
      DOSEN: "bg-green-100 text-green-700",
      ADMIN: "bg-purple-100 text-purple-700",
    };
    return colorMap[role] || "bg-gray-100 text-gray-700";
  };

  const getIdLabel = (role: string) => {
    if (role === "MAHASISWA") return "NIM";
    if (role === "DOSEN") return "NIP";
    return "ID Admin Prodi";
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Validate required fields
    if (!formData.name.trim()) {
      errors.push("Nama: Silakan isi nama lengkap Anda");
    }

    if (!formData.nim.trim()) {
      errors.push(`${getIdLabel(user.role)}: Silakan isi ${getIdLabel(user.role)} Anda`);
    }

    if (!formData.prodi) {
      errors.push("Program Studi: Silakan pilih program studi yang tersedia");
    }

    // Validate phone number (required)
    if (!formData.telepon || !formData.telepon.trim()) {
      errors.push("Nomor Telepon: Silakan isi nomor telepon Anda");
    } else {
      const phoneRegex = /^(\+62|62|0)[8-9][0-9]{7,11}$/;
      if (!phoneRegex.test(formData.telepon.trim())) {
        errors.push("Nomor Telepon: Format tidak valid. Gunakan format: 08123456789");
      }
    }

    // Validate dosen pembimbing for MAHASISWA
    if (user.role === "MAHASISWA" && !formData.dosenPembimbingId) {
      errors.push("Dosen Pembimbing: Silakan pilih dosen pembimbing Anda");
    }

    // Show errors if any
    if (errors.length > 0) {
      setErrorMessage(errors.join("\n"));
      setShowErrorModal(true);
      return false;
    }

    return true;
  };

  // ✅ Format error messages to be more user-friendly
  const formatErrorMessage = (result: any): string => {
    if (result.fieldErrors) {
      const fieldLabelMap: Record<string, string> = {
        name: "Nama",
        nim: getIdLabel(user.role),
        prodi: "Program Studi",
        telepon: "Nomor Telepon",
        dosenPembimbingId: "Dosen Pembimbing",
      };

      const errors: string[] = [];

      Object.entries(result.fieldErrors).forEach(([field, errorList]) => {
        const fieldLabel = fieldLabelMap[field] || field;
        const errorMessages = Array.isArray(errorList) ? errorList : [errorList];

        errorMessages.forEach((err: any) => {
          const errorText = typeof err === 'string' ? err : String(err);
          
          // Format: "Field: Error message"
          if (field === "name") {
            if (errorText.includes("kosong") || errorText.includes("Required")) {
              errors.push(`${fieldLabel}: Silakan isi nama lengkap Anda`);
            } else if (errorText.includes("panjang")) {
              errors.push(`${fieldLabel}: Maksimal 100 karakter`);
            } else {
              errors.push(`${fieldLabel}: Format tidak valid`);
            }
          } else if (field === "nim") {
            if (errorText.includes("wajib") || errorText.includes("Required") || errorText.includes("min")) {
              errors.push(`${fieldLabel}: Silakan isi ${fieldLabel} Anda`);
            } else {
              errors.push(`${fieldLabel}: Format tidak valid`);
            }
          } else if (field === "prodi") {
            errors.push(`${fieldLabel}: Silakan pilih program studi yang tersedia`);
          } else if (field === "telepon") {
            if (errorText.includes("Format nomor telepon tidak valid") || errorText.includes("regex")) {
              errors.push(`${fieldLabel}: Format tidak valid. Gunakan format: 08123456789`);
            } else {
              errors.push(`${fieldLabel}: Format tidak valid`);
            }
          } else if (field === "dosenPembimbingId") {
            errors.push(`${fieldLabel}: Silakan pilih dosen pembimbing Anda`);
          }
        });
      });

      // Return formatted errors or a generic message
      return errors.length > 0 
        ? errors.join("\n") 
        : "Mohon periksa kembali data yang Anda masukkan";
    }

    // Return generic error message
    return result.error || "Gagal memperbarui profil. Silakan coba lagi.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Always append name (required)
      formDataToSend.append("name", formData.name.trim());
      
      // Append optional fields - send empty string if not filled
      formDataToSend.append("nim", formData.nim.trim());
      formDataToSend.append("prodi", formData.prodi);
      formDataToSend.append("telepon", formData.telepon.trim());
      
      // Only append dosenPembimbingId for MAHASISWA
      if (user.role === "MAHASISWA") {
        formDataToSend.append("dosenPembimbingId", formData.dosenPembimbingId);
      }

      const result = await updateProfile(formDataToSend);

      if (result.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          router.refresh();
        }, 2000);
      } else {
        // ✅ Use the improved error formatting
        const friendlyErrorMessage = formatErrorMessage(result);
        setErrorMessage(friendlyErrorMessage);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Terjadi kesalahan saat memperbarui profil. Silakan coba lagi.");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div onSubmit={handleSubmit} className="space-y-6">
        <Card className="rounded-xl border shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Informasi Profil
              </h2>
              <span
                className={`rounded-full px-4 py-1 text-sm font-medium ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {getRoleLabel(user.role)}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-4 md:col-span-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nim">
                      {getIdLabel(user.role)} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nim"
                      value={formData.nim}
                      onChange={(e) =>
                        setFormData({ ...formData, nim: e.target.value })
                      }
                      placeholder={`Masukkan ${getIdLabel(user.role)}`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prodi">
                      Program Studi <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.prodi}
                      onValueChange={(value) =>
                        setFormData({ ...formData, prodi: value })
                      }
                      required
                    >
                      <SelectTrigger>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departemen">Departemen</Label>
                    <Input
                      id="departemen"
                      value={user.departemen || ""}
                      disabled
                      className="bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                      className="bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telepon">
                      No Telepon <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="telepon"
                      value={formData.telepon}
                      onChange={(e) =>
                        setFormData({ ...formData, telepon: e.target.value })
                      }
                      placeholder="08123456789"
                      required
                    />
                  </div>

                  {user.role === "MAHASISWA" && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="dosenPembimbing">
                        Dosen Pembimbing <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.dosenPembimbingId}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            dosenPembimbingId: value,
                          })
                        }
                        required
                      >
                        <SelectTrigger>
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
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-40 w-40 rounded-xl border-4 border-gray-100">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback className="rounded-xl bg-blue-100 text-4xl text-blue-600">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Foto Profil</p>
                  <p className="text-xs text-gray-400">
                    Fitur upload foto akan segera hadir
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-start">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <DialogTitle className="text-center">Berhasil!</DialogTitle>
            <DialogDescription className="text-center">
              Profil Anda berhasil diperbarui
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Gagal!</DialogTitle>
            <DialogDescription className="text-center whitespace-pre-line">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowErrorModal(false)}
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}