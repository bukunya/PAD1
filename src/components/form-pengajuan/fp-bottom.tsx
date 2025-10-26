"use client";

import { useFormStatus } from "react-dom";
import { submitBerkas, type FormState } from "@/lib/actions/supabaseBerkas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState, useEffect, useState } from "react";
import { getFormPengajuanProfile } from "@/lib/actions/formPengajuan";
import { redirect } from "next/navigation";

// Komponen tombol terpisah untuk menampilkan status "pending"
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Mengunggah..." : "Kirim Pengajuan"}
    </Button>
  );
}

export default function FpBottom() {
  // Inisialisasi state formulir
  const initialState: FormState = { success: false, message: "" };
  const [state, formAction] = useActionState(submitBerkas, initialState);
  const [dosenPembimbing, setDosenPembimbing] = useState<{
    dosenPembimbingId: string | null;
    dosenPembimbing: string | null;
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getFormPengajuanProfile();
        if (profile) {
          setDosenPembimbing({
            dosenPembimbingId: profile.dosenPembimbingId || null,
            dosenPembimbing: profile.dosenPembimbing?.name || null,
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    if (state.success) {
      alert(state.message); // Atau gunakan toast/notifikasi yang lebih baik
      // Anda bisa mereset formulir di sini
      redirect("/dashboard"); // Arahkan ulang ke dashboard setelah sukses
    } else if (state.message) {
      alert(state.message); // Tampilkan pesan error
    }
  }, [state]);

  return (
    <div className="gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Berkas</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Formulir memanggil Server Action */}
          <form action={formAction} className="space-y-4">
            <input
              type="hidden"
              name="dosenPembimbingId"
              value={dosenPembimbing?.dosenPembimbingId || ""}
            />

            <div className="space-y-2">
              <Label htmlFor="judul">Judul Tugas Akhir</Label>
              <Input id="judul" name="judul" type="text" required />
            </div>

            <div className="space-y-2">
              <Label>Dosen Pembimbing</Label>
              <Input
                id="dosenPembimbingName"
                name="dosenPembimbingName"
                value={dosenPembimbing?.dosenPembimbing || ""}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="berkas">Berkas Ujian (PDF)</Label>
              <Input
                id="berkas"
                name="berkas"
                type="file"
                accept=".pdf" // Hanya terima PDF
                required
              />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
