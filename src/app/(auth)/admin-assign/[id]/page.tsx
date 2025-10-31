"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { statistics } from "@/lib/actions/statistics";
import { getUjianDetails, assignUjian } from "@/lib/actions/adminAssign";
import { AlertCircle, CheckCircle, Loader2, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState, use } from "react";

interface UjianData {
  id: string;
  judul: string;
  status: string;
  mahasiswa: {
    id: string;
    name: string | null;
    nim: string | null;
    prodi: string | null;
  };
  dosenPembimbing: {
    id: string;
    name: string | null;
  };
  dosenPenguji: Array<{
    dosen: {
      id: string;
      name: string | null;
    };
  }>;
  tanggalUjian: Date | null;
  jamMulai: Date | null;
  jamSelesai: Date | null;
  ruangan: string | null;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const resolvedParams = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    calendarLink?: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [ujianData, setUjianData] = useState<UjianData | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    tanggalUjian: "",
    jamMulai: "",
    jamSelesai: "",
    ruangan: "",
    dosenPenguji1: "",
    dosenPenguji2: "",
  });

  const [dosenList, setDosenList] = useState<
    Array<{ id: string; name: string | null }>
  >([]);

  useEffect(() => {
    async function loadData() {
      if (status === "loading") return;

      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      if (session.user.role !== "ADMIN") {
        setMessage({
          type: "error",
          text: "Akses ditolak. Hanya admin yang dapat mengakses halaman ini.",
        });
        setIsLoading(false);
        return;
      }

      try {
        // Load ujian details and dosen list in parallel
        const [ujianResult, dosensResult] = await Promise.all([
          getUjianDetails(resolvedParams.id),
          statistics(),
        ]);

        if (!ujianResult.success) {
          setMessage({
            type: "error",
            text: ujianResult.error || "Gagal memuat data ujian",
          });
          setIsLoading(false);
          return;
        }

        if (ujianResult.data) {
          setUjianData(ujianResult.data as UjianData);

          // Pre-fill form if data exists
          if (ujianResult.data.tanggalUjian) {
            const tanggal = new Date(ujianResult.data.tanggalUjian);
            setFormData((prev) => ({
              ...prev,
              tanggalUjian: tanggal.toISOString().split("T")[0],
            }));
          }
          if (ujianResult.data.jamMulai) {
            const jamMulai = new Date(ujianResult.data.jamMulai);
            setFormData((prev) => ({
              ...prev,
              jamMulai: jamMulai.toTimeString().slice(0, 5),
            }));
          }
          if (ujianResult.data.jamSelesai) {
            const jamSelesai = new Date(ujianResult.data.jamSelesai);
            setFormData((prev) => ({
              ...prev,
              jamSelesai: jamSelesai.toTimeString().slice(0, 5),
            }));
          }
          if (ujianResult.data.ruangan) {
            setFormData((prev) => ({
              ...prev,
              ruangan: ujianResult.data.ruangan || "",
            }));
          }
          if (ujianResult.data.dosenPenguji.length > 0) {
            setFormData((prev) => ({
              ...prev,
              dosenPenguji1: ujianResult.data.dosenPenguji[0]?.dosen.id || "",
              dosenPenguji2: ujianResult.data.dosenPenguji[1]?.dosen.id || "",
            }));
          }
        }

        if (dosensResult.success && dosensResult.data) {
          setDosenList(
            dosensResult.data.dosen.map((d) => ({
              id: d.id,
              name: d.name || "",
            })) || []
          );
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setMessage({ type: "error", text: "Gagal memuat data" });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [session, status, resolvedParams.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setFieldErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("ujianId", resolvedParams.id);
      formDataToSend.append("tanggalUjian", formData.tanggalUjian);
      formDataToSend.append("jamMulai", formData.jamMulai);
      formDataToSend.append("jamSelesai", formData.jamSelesai);
      formDataToSend.append("ruangan", formData.ruangan);
      formDataToSend.append("dosenPenguji1", formData.dosenPenguji1);
      formDataToSend.append("dosenPenguji2", formData.dosenPenguji2);

      const result = await assignUjian(formDataToSend);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Ujian berhasil dijadwalkan",
          calendarLink: result.calendarEventLink || undefined,
        });
        // Reload data after successful assignment
        const ujianResult = await getUjianDetails(resolvedParams.id);
        if (ujianResult.success && ujianResult.data) {
          setUjianData(ujianResult.data as UjianData);
        }
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        } else {
          setMessage({
            type: "error",
            text: result.error || "Terjadi kesalahan saat menjadwalkan ujian",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat menjadwalkan ujian",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Show error if not admin
  if (!session?.user || session.user.role !== "ADMIN") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Akses ditolak. Hanya admin yang dapat mengakses halaman ini.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show error if ujian not found
  if (!ujianData) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Ujian tidak ditemukan.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Jadwalkan Ujian</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Status Messages */}
          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
              className="mb-6"
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {message.text}
                {message.calendarLink && (
                  <div className="mt-2">
                    <a
                      href={message.calendarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Lihat Event di Google Calendar →
                    </a>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Ujian Info */}
          <div className="mb-6 space-y-2 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-lg">Informasi Ujian</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Mahasiswa:</span>{" "}
                {ujianData.mahasiswa.name} ({ujianData.mahasiswa.nim})
              </div>
              <div>
                <span className="font-medium">Judul:</span> {ujianData.judul}
              </div>
              <div>
                <span className="font-medium">Status:</span> {ujianData.status}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dosen Pembimbing (Read-only) */}
            <div className="space-y-2">
              <Label>Dosen Pembimbing</Label>
              <Input value={ujianData.dosenPembimbing.name || ""} disabled />
            </div>

            {/* Tanggal Ujian */}
            <div className="space-y-2">
              <Label htmlFor="tanggalUjian">Tanggal Ujian *</Label>
              <Input
                id="tanggalUjian"
                name="tanggalUjian"
                type="date"
                value={formData.tanggalUjian}
                onChange={(e) =>
                  handleInputChange("tanggalUjian", e.target.value)
                }
                disabled={isSaving}
                required
              />
              {fieldErrors.tanggalUjian && (
                <p className="text-sm text-destructive">
                  {fieldErrors.tanggalUjian[0]}
                </p>
              )}
            </div>

            {/* Jam Mulai */}
            <div className="space-y-2">
              <Label htmlFor="jamMulai">Jam Mulai *</Label>
              <Input
                id="jamMulai"
                name="jamMulai"
                type="time"
                value={formData.jamMulai}
                onChange={(e) => handleInputChange("jamMulai", e.target.value)}
                disabled={isSaving}
                required
              />
              {fieldErrors.jamMulai && (
                <p className="text-sm text-destructive">
                  {fieldErrors.jamMulai[0]}
                </p>
              )}
            </div>

            {/* Jam Selesai */}
            <div className="space-y-2">
              <Label htmlFor="jamSelesai">Jam Selesai *</Label>
              <Input
                id="jamSelesai"
                name="jamSelesai"
                type="time"
                value={formData.jamSelesai}
                onChange={(e) =>
                  handleInputChange("jamSelesai", e.target.value)
                }
                disabled={isSaving}
                required
              />
              {fieldErrors.jamSelesai && (
                <p className="text-sm text-destructive">
                  {fieldErrors.jamSelesai[0]}
                </p>
              )}
            </div>

            {/* Ruangan */}
            <div className="space-y-2">
              <Label htmlFor="ruangan">Ruangan *</Label>
              <Input
                id="ruangan"
                name="ruangan"
                type="text"
                value={formData.ruangan}
                onChange={(e) => handleInputChange("ruangan", e.target.value)}
                placeholder="Contoh: Ruang 301"
                disabled={isSaving}
                required
              />
              {fieldErrors.ruangan && (
                <p className="text-sm text-destructive">
                  {fieldErrors.ruangan[0]}
                </p>
              )}
            </div>

            {/* Dosen Penguji 1 */}
            <div className="space-y-2">
              <Label htmlFor="dosenPenguji1">Dosen Penguji 1 *</Label>
              <Select
                value={formData.dosenPenguji1}
                onValueChange={(value) =>
                  handleInputChange("dosenPenguji1", value)
                }
                disabled={isSaving}
              >
                <SelectTrigger id="dosenPenguji1">
                  <SelectValue placeholder="Pilih Dosen Penguji 1" />
                </SelectTrigger>
                <SelectContent>
                  {dosenList.map((dosen) => (
                    <SelectItem key={dosen.id} value={dosen.id}>
                      {dosen.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.dosenPenguji1Id && (
                <p className="text-sm text-destructive">
                  {fieldErrors.dosenPenguji1Id[0]}
                </p>
              )}
            </div>

            {/* Dosen Penguji 2 */}
            <div className="space-y-2">
              <Label htmlFor="dosenPenguji2">Dosen Penguji 2 *</Label>
              <Select
                value={formData.dosenPenguji2}
                onValueChange={(value) =>
                  handleInputChange("dosenPenguji2", value)
                }
                disabled={isSaving}
              >
                <SelectTrigger id="dosenPenguji2">
                  <SelectValue placeholder="Pilih Dosen Penguji 2" />
                </SelectTrigger>
                <SelectContent>
                  {dosenList.map((dosen) => (
                    <SelectItem key={dosen.id} value={dosen.id}>
                      {dosen.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.dosenPenguji2Id && (
                <p className="text-sm text-destructive">
                  {fieldErrors.dosenPenguji2Id[0]}
                </p>
              )}
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Jadwalkan Ujian
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
