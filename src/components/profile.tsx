"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateProfile, getUserProfile } from "@/lib/actions/profile";
import { Prodi } from "@/generated/prisma";

/**
 * Profile component for managing user profile information
 * Integrates with Auth.js v5 for session management and server actions for data updates
 */
export function Profile() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    prodi: "" as Prodi | "",
    telepon: "",
  });

  // User data from database
  const [userData, setUserData] = useState<{
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    nim: string | null;
    prodi: Prodi | null;
    departemen: string | null;
    telepon: string | null;
  } | null>(null);

  // Load user profile data on component mount
  useEffect(() => {
    async function loadProfile() {
      if (status === "loading") return;

      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile();
        if (profile) {
          setUserData(profile);
          setFormData({
            name: profile.name || "",
            nim: profile.nim || "",
            prodi: profile.prodi || "",
            telepon: profile.telepon || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setMessage({ type: "error", text: "Gagal memuat data profil" });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [session, status]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setFieldErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (formData.nim) formDataToSend.append("nim", formData.nim);
      if (formData.prodi) formDataToSend.append("prodi", formData.prodi);
      if (formData.telepon) formDataToSend.append("telepon", formData.telepon);

      const result = await updateProfile(formDataToSend);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Profil berhasil diperbarui",
        });
        // Refresh user data
        const updatedProfile = await getUserProfile();
        if (updatedProfile) {
          setUserData(updatedProfile);
        }
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        } else {
          setMessage({
            type: "error",
            text: result.error || "Terjadi kesalahan saat menyimpan perubahan",
          });
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat menyimpan perubahan",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };

  // Format Prodi enum values for display
  const formatProdi = (prodi: Prodi) => {
    const formatMap: Record<Prodi, string> = {
      TeknologiRekayasaPerangkatLunak: "Teknologi Rekayasa Perangkat Lunak",
      TeknologiRekayasaElektro: "Teknologi Rekayasa Elektro",
      TeknologiRekayasaInternet: "Teknologi Rekayasa Internet",
      TeknologiRekayasaInstrumentasiDanKontrol:
        "Teknologi Rekayasa Instrumentasi dan Kontrol",
    };
    return formatMap[prodi];
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading state while checking authentication
  if (status === "loading" || isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!session?.user) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Anda harus login untuk mengakses halaman profil.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main User Data Section */}
      <div className="lg:col-span-2">
        <Card variant={"invisible"}>
          <CardHeader>
            <CardTitle className="text-2xl">Profil</CardTitle>
          </CardHeader>

          {/* Status Messages */}
          {message && (
            <div className="px-6">
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
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap *</Label>
                <Input
                  id="nama"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  disabled={isSaving}
                />
                {fieldErrors.name && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.name[0]}
                  </p>
                )}
              </div>

              {/* NIM Field */}
              <div className="space-y-2">
                {userData?.role === "MAHASISWA" ? (
                  <Label htmlFor="nim">NIM</Label>
                ) : (
                  <Label htmlFor="nim">ID Dosen</Label>
                )}
                <Input
                  id="nim"
                  name="nim"
                  value={formData.nim}
                  onChange={(e) => handleInputChange("nim", e.target.value)}
                  placeholder="Masukkan NIM Anda"
                  disabled={isSaving}
                />
                {fieldErrors.nim && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.nim[0]}
                  </p>
                )}
              </div>

              {/* Program Studi Field */}
              <div className="space-y-2">
                <Label htmlFor="prodi">Program Studi</Label>
                <Select
                  value={formData.prodi}
                  onValueChange={(value) => handleInputChange("prodi", value)}
                  disabled={isSaving}
                >
                  <SelectTrigger id="prodi">
                    <SelectValue placeholder="Pilih Program Studi" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Prodi).map((prodi) => (
                      <SelectItem key={prodi} value={prodi}>
                        {formatProdi(prodi)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.prodi && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.prodi[0]}
                  </p>
                )}
              </div>

              {/* Department Field (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="departemen">Departemen</Label>
                <Input
                  id="departemen"
                  value={
                    userData?.departemen ??
                    "Departemen Teknik Elektro dan Informatika"
                  }
                  disabled
                />
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData?.email ?? ""}
                  disabled
                />
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="telepon">No. Telepon</Label>
                <Input
                  id="telepon"
                  name="telepon"
                  type="tel"
                  value={formData.telepon}
                  onChange={(e) => handleInputChange("telepon", e.target.value)}
                  placeholder="085159917205"
                  disabled={isSaving}
                />
                {fieldErrors.telepon && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.telepon[0]}
                  </p>
                )}
              </div>
            </CardContent>

            <div className="pt-8">
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
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
              </CardFooter>
            </div>
          </form>
        </Card>
      </div>

      {/* Profile Photo Section */}
      <div className="lg:col-span-1">
        <Card variant={"invisible"}>
          <CardHeader>
            <CardTitle className="text-2xl">Foto Profil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6 pt-2">
            <Avatar className="w-full h-auto border-4 border-muted">
              <AvatarImage
                src={userData?.image ?? undefined}
                alt="Foto profil pengguna"
              />
              <AvatarFallback className="text-4xl">
                {getInitials(userData?.name ?? null)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" disabled>
              <Camera className="mr-2 h-4 w-4" />
              Ganti Foto
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Fitur upload foto profil akan segera hadir.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
