// src/components/form-penjadwalan/penjadwalan-modal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import {
  getUjianDetails,
  assignUjian,
  getAllDosen,
  getAvailableDosen,
  getAvailableRuangan,
  getAllRuangan,
} from "@/lib/actions/adminAssignUjian/adminJadwalin";
import { useRouter } from "next/navigation";

interface UjianData {
  mahasiswa: {
    name: string | null;
  };
  dosenPembimbing: {
    id: string;
    name: string | null;
  };
}

interface PenjadwalanModalProps {
  pengajuanId: string;
  onClose: () => void;
}

export function PenjadwalanModal({
  pengajuanId,
  onClose,
}: PenjadwalanModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<UjianData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form state
  const [formData, setFormData] = useState({
    tanggalUjian: "",
    jamMulai: "",
    jamSelesai: "",
    ruanganId: "",
    dosenPenguji1: "",
    dosenPenguji2: "",
    catatan: "",
  });

  const [dosenList, setDosenList] = useState<
    Array<{ id: string; name: string | null }>
  >([]);

  const [availableDosen, setAvailableDosen] = useState<
    Array<{ id: string; name: string | null }>
  >([]);

  const [availableRuangan, setAvailableRuangan] = useState<
    Array<{ id: string; nama: string; deskripsi: string | null }>
  >([]);

  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [jamSelesaiManuallySet, setJamSelesaiManuallySet] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const [ujianResult, dosenResult, ruanganResult] = await Promise.all([
          getUjianDetails(pengajuanId),
          getAllDosen(),
          getAllRuangan(),
        ]);

        if (ujianResult.success && ujianResult.data) {
          setData(ujianResult.data);
        } else {
          setError(ujianResult.error || "Gagal memuat data");
        }

        if (dosenResult.success && dosenResult.data) {
          const allDosen = dosenResult.data.map(
            (d: { id: string; name: string | null }) => ({
              id: d.id,
              name: d.name || "",
            })
          );
          setDosenList(allDosen);
          setAvailableDosen(allDosen);
        }

        if (ruanganResult.success && ruanganResult.data) {
          setAvailableRuangan(ruanganResult.data);
        }
      } catch {
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [pengajuanId]);

  // Check dosen availability when date/time changes
  useEffect(() => {
    async function checkAvailability() {
      if (
        !formData.tanggalUjian ||
        !formData.jamMulai ||
        !formData.jamSelesai
      ) {
        // When no date/time selected, show all dosen and ruangan
        setAvailableDosen(dosenList);
        // Don't reset availableRuangan here - keep all rooms visible initially
        return;
      }

      setIsCheckingAvailability(true);
      try {
        const [dosenResult, ruanganResult] = await Promise.all([
          getAvailableDosen(
            formData.tanggalUjian,
            formData.jamMulai,
            formData.jamSelesai,
            pengajuanId
          ),
          getAvailableRuangan(
            formData.tanggalUjian,
            formData.jamMulai,
            formData.jamSelesai,
            pengajuanId
          ),
        ]);

        if (dosenResult.success && dosenResult.data) {
          setAvailableDosen(dosenResult.data.available);

          // Clear selected dosen if they become unavailable
          if (formData.dosenPenguji1) {
            const isPenguji1Available = dosenResult.data.available.some(
              (d) => d.id === formData.dosenPenguji1
            );
            if (!isPenguji1Available) {
              setFormData((prev) => ({ ...prev, dosenPenguji1: "" }));
            }
          }

          if (formData.dosenPenguji2) {
            const isPenguji2Available = dosenResult.data.available.some(
              (d) => d.id === formData.dosenPenguji2
            );
            if (!isPenguji2Available) {
              setFormData((prev) => ({ ...prev, dosenPenguji2: "" }));
            }
          }
        }

        if (ruanganResult.success && ruanganResult.data) {
          setAvailableRuangan(ruanganResult.data.available);

          // Clear selected ruangan if it becomes unavailable
          if (formData.ruanganId) {
            const isRuanganAvailable = ruanganResult.data.available.some(
              (r) => r.id === formData.ruanganId
            );
            if (!isRuanganAvailable) {
              setFormData((prev) => ({ ...prev, ruanganId: "" }));
            }
          }
        }
      } catch {
        console.error("Error checking availability");
      } finally {
        setIsCheckingAvailability(false);
      }
    }

    checkAvailability();
  }, [
    formData.tanggalUjian,
    formData.jamMulai,
    formData.jamSelesai,
    formData.dosenPenguji1,
    formData.dosenPenguji2,
    formData.ruanganId,
    dosenList,
    pengajuanId,
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Auto-fill jam selesai when jam mulai changes (2 hours default)
      if (field === "jamMulai" && value && !jamSelesaiManuallySet) {
        console.log(
          "Autofill jamSelesai based on jamMulai fp-modal 181:",
          value
        );
        const [hours, minutes] = value.split(":").map(Number);
        const endTime = new Date();
        endTime.setHours(hours + 2, minutes);
        newData.jamSelesai = endTime.toTimeString().slice(0, 5);
      }

      return newData;
    });

    if (field === "jamSelesai") {
      setJamSelesaiManuallySet(true);
    }

    if (field === "jamMulai") {
      setJamSelesaiManuallySet(false);
    }

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
      formDataToSend.append("ujianId", pengajuanId);
      formDataToSend.append("tanggalUjian", formData.tanggalUjian);
      formDataToSend.append("jamMulai", formData.jamMulai);
      formDataToSend.append("jamSelesai", formData.jamSelesai);
      formDataToSend.append("ruanganId", formData.ruanganId);
      formDataToSend.append("dosenPenguji1", formData.dosenPenguji1);
      formDataToSend.append("dosenPenguji2", formData.dosenPenguji2);

      const result = await assignUjian(formDataToSend);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Ujian berhasil dijadwalkan",
        });

        setTimeout(() => {
          router.refresh();
          onClose();
        }, 1500);
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        } else {
          setMessage({
            type: "error",
            text: result.error || "Gagal menjadwalkan ujian",
          });
        }
      }
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat menjadwalkan ujian",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Jadwal Ujian</DialogTitle>
          {data && (
            <p className="text-sm text-muted-foreground mt-1">
              {data.mahasiswa.name}
            </p>
          )}
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Message */}
            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
                className={
                  message.type === "warning"
                    ? "border-yellow-500 bg-yellow-50"
                    : ""
                }
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {/* Grid Layout for Form */}
            <div className="grid grid-cols-3 gap-4">
              {/* Tanggal */}
              <div className="space-y-2">
                <Label htmlFor="tanggalUjian" className="text-muted-foreground">
                  Tanggal
                </Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tanggalUjian"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.tanggalUjian}
                    onChange={(e) =>
                      handleInputChange("tanggalUjian", e.target.value)
                    }
                    disabled={isSaving}
                    required
                    className="pl-10"
                  />
                </div>
                {fieldErrors.tanggalUjian && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.tanggalUjian[0]}
                  </p>
                )}
              </div>

              {/* Jam Mulai */}
              <div className="space-y-2">
                <Label htmlFor="jamMulai" className="text-muted-foreground">
                  Jam Mulai
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="jamMulai"
                    type="time"
                    value={formData.jamMulai}
                    onChange={(e) =>
                      handleInputChange("jamMulai", e.target.value)
                    }
                    disabled={isSaving}
                    required
                    className="pl-10"
                  />
                </div>
                {fieldErrors.jamMulai && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.jamMulai[0]}
                  </p>
                )}
              </div>

              {/* Jam Selesai */}
              <div className="space-y-2">
                <Label htmlFor="jamSelesai" className="text-muted-foreground">
                  Jam Selesai
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="jamSelesai"
                    type="time"
                    value={formData.jamSelesai}
                    onChange={(e) =>
                      handleInputChange("jamSelesai", e.target.value)
                    }
                    disabled={isSaving}
                    required
                    className="pl-10"
                  />
                </div>
                {fieldErrors.jamSelesai && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.jamSelesai[0]}
                  </p>
                )}
              </div>

              {/* Ruangan */}
              <div className="space-y-2">
                <Label htmlFor="ruanganId" className="text-muted-foreground">
                  Ruangan
                  {isCheckingAvailability && (
                    <span className="ml-2 text-xs">(Memeriksa...)</span>
                  )}
                </Label>
                <Select
                  value={formData.ruanganId}
                  onValueChange={(value) =>
                    handleInputChange("ruanganId", value)
                  }
                  disabled={isSaving || isCheckingAvailability}
                >
                  <SelectTrigger id="ruanganId">
                    <SelectValue placeholder="Pilih Ruangan" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRuangan.length > 0 ? (
                      availableRuangan.map((ruangan) => (
                        <SelectItem key={ruangan.id} value={ruangan.id}>
                          {ruangan.nama}
                          {ruangan.deskripsi && (
                            <span className="text-xs text-muted-foreground ml-2">
                              - {ruangan.deskripsi}
                            </span>
                          )}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {isCheckingAvailability
                          ? "Memeriksa ketersediaan ruangan..."
                          : formData.tanggalUjian &&
                            formData.jamMulai &&
                            formData.jamSelesai
                          ? "Tidak ada ruangan tersedia pada waktu ini"
                          : "Pilih tanggal dan waktu terlebih dahulu"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {fieldErrors.ruanganId && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.ruanganId[0]}
                  </p>
                )}
              </div>

              {/* Pembimbing 1 (Read-only) */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Pembimbing 1</Label>
                <Input
                  value={data?.dosenPembimbing.name || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Empty space for grid alignment */}
              <div></div>

              {/* Pembimbing 2 (Select) */}
              <div className="space-y-2">
                <Label
                  htmlFor="dosenPenguji1"
                  className="text-muted-foreground"
                >
                  Pembimbing 2
                  {isCheckingAvailability && (
                    <span className="ml-2 text-xs">(Memeriksa...)</span>
                  )}
                </Label>
                <Select
                  value={formData.dosenPenguji1}
                  onValueChange={(value) =>
                    handleInputChange("dosenPenguji1", value)
                  }
                  disabled={isSaving || isCheckingAvailability}
                >
                  <SelectTrigger id="dosenPenguji1">
                    <SelectValue placeholder="Pilih Pembimbing 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDosen
                      .filter(
                        (d) =>
                          d.id !== formData.dosenPenguji2 &&
                          d.id !== data?.dosenPembimbing.id
                      )
                      .map((dosen) => (
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

              {/* Penguji */}
              <div className="space-y-2">
                <Label
                  htmlFor="dosenPenguji2"
                  className="text-muted-foreground"
                >
                  Penguji
                  {isCheckingAvailability && (
                    <span className="ml-2 text-xs">(Memeriksa...)</span>
                  )}
                </Label>
                <Select
                  value={formData.dosenPenguji2}
                  onValueChange={(value) =>
                    handleInputChange("dosenPenguji2", value)
                  }
                  disabled={isSaving || isCheckingAvailability}
                >
                  <SelectTrigger id="dosenPenguji2">
                    <SelectValue placeholder="Pilih Penguji" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDosen
                      .filter(
                        (d) =>
                          d.id !== formData.dosenPenguji1 &&
                          d.id !== data?.dosenPembimbing.id
                      )
                      .map((dosen) => (
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
            </div>

            {/* Catatan */}
            <div className="space-y-2">
              <Label htmlFor="catatan" className="text-muted-foreground">
                Catatan
              </Label>
              <textarea
                id="catatan"
                value={formData.catatan}
                onChange={(e) => handleInputChange("catatan", e.target.value)}
                placeholder="Silakan hadir 15 menit sebelum ujian dimulai dan membawa dokumen cetak."
                rows={3}
                disabled={isSaving}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-40 bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "SUBMIT"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
