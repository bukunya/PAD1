"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  Edit,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  getAllRuangan,
  createRuangan,
  updateRuangan,
  deleteRuangan,
} from "@/lib/actions/ruangan";

interface Ruangan {
  id: string;
  nama: string;
  deskripsi: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function RuanganPage() {
  const { data: session, status } = useSession();
  const [ruanganList, setRuanganList] = useState<Ruangan[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "ADMIN") {
      setLoading(false);
      return;
    }
    fetchRuangan();
  }, [session, status]);

  const fetchRuangan = async () => {
    startTransition(async () => {
      const result = await getAllRuangan();
      if (result.success && result.data) {
        setRuanganList(result.data);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Gagal mengambil data ruangan",
        });
      }
      setLoading(false);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.nama.trim()) {
      setMessage({ type: "error", text: "Nama ruangan wajib diisi" });
      return;
    }

    startTransition(async () => {
      const formDataObj = new FormData();
      formDataObj.append("nama", formData.nama);
      formDataObj.append("deskripsi", formData.deskripsi);

      const result = editingId
        ? await updateRuangan(editingId, formDataObj)
        : await createRuangan(formDataObj);

      if (result.success) {
        setMessage({
          type: "success",
          text:
            result.message ||
            (editingId
              ? "Ruangan berhasil diperbarui"
              : "Ruangan berhasil ditambahkan"),
        });
        setFormData({ nama: "", deskripsi: "" });
        setIsAdding(false);
        setEditingId(null);
        fetchRuangan();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Terjadi kesalahan",
        });
      }
    });
  };

  const handleEdit = (ruangan: Ruangan) => {
    setFormData({
      nama: ruangan.nama,
      deskripsi: ruangan.deskripsi || "",
    });
    setEditingId(ruangan.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ruangan ini?")) return;

    startTransition(async () => {
      const result = await deleteRuangan(id);
      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Ruangan berhasil dihapus",
        });
        fetchRuangan();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Gagal menghapus ruangan",
        });
      }
    });
  };

  const resetForm = () => {
    setFormData({ nama: "", deskripsi: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manajemen Ruangan</CardTitle>
            <Button onClick={() => setIsAdding(!isAdding)}>
              {isAdding ? "Batal" : "Tambah Ruangan"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Messages */}
          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
              className="mb-6"
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Add/Edit Form */}
          {isAdding && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingId ? "Edit Ruangan" : "Tambah Ruangan Baru"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Ruangan *</Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                      placeholder="Contoh: HU207"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deskripsi">Deskripsi</Label>
                    <Input
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData({ ...formData, deskripsi: e.target.value })
                      }
                      placeholder="Deskripsi ruangan (opsional)"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      {editingId ? "Perbarui" : "Simpan"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-blue-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Nama Ruangan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Deskripsi
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Dibuat
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {ruanganList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Belum ada ruangan
                    </td>
                  </tr>
                ) : (
                  ruanganList.map((ruangan) => (
                    <tr key={ruangan.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">
                        {ruangan.nama}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {ruangan.deskripsi || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {ruangan.createdAt.toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(ruangan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(ruangan.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
