"use server"; // Menandakan ini adalah Server Action

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth"; // Impor Auth.js Anda
import { revalidatePath } from "next/cache";

// Definisikan state untuk formulir
export type FormState = {
  success: boolean;
  message: string;
};

export async function submitBerkas(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Dapatkan sesi pengguna
  const session = await auth();
  if (!session?.user || session.user.role !== "MAHASISWA") {
    return { success: false, message: "Akses ditolak." };
  }

  // 2. Dapatkan data dari formulir
  const file = formData.get("berkas") as File;
  const judul = formData.get("judul") as string;
  const dosenPembimbingId = formData.get("dosenPembimbingId") as string; // Pastikan Anda memiliki input ini di formulir

  // 3. Validasi dasar
  if (!file || file.size === 0) {
    return { success: false, message: "Berkas ujian wajib diunggah." };
  }
  if (!judul || !dosenPembimbingId) {
    return {
      success: false,
      message: "Judul dan dosen pembimbing wajib diisi.",
    };
  }

  try {
    // 4. Buat nama file yang unik untuk menghindari konflik
    const fileExtension = file.name.split(".").pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExtension}`;
    const filePath = `public/${fileName}`; // Folder 'public' di dalam bucket

    // 5. Unggah file ke Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("dokumen") // Nama bucket Anda
      .upload(filePath, file);

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError.message);
      return {
        success: false,
        message: `Gagal mengunggah file: ${uploadError.message}`,
      };
    }

    // 6. Dapatkan URL publik dari file yang baru diunggah
    const { data: urlData } = supabaseAdmin.storage
      .from("dokumen")
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      return { success: false, message: "Gagal mendapatkan URL publik file." };
    }

    const publicUrl = urlData.publicUrl;

    // 7. Simpan informasi ke database Prisma Anda
    await prisma.ujian.create({
      data: {
        judul: judul,
        berkasUrl: publicUrl,
        mahasiswaId: session.user.id,
        dosenPembimbingId: dosenPembimbingId,
        status: "MENUNGGU_VERIFIKASI",
      },
    });

    // 8. Berhasil!
    revalidatePath("/dashboard"); // Perbarui halaman dashboard
    return { success: true, message: "Pengajuan ujian berhasil dikirim." };
  } catch (e: unknown) {
    console.error("Error:", e instanceof Error ? e.message : String(e));
    return { success: false, message: "Terjadi kesalahan pada server." };
  }
}
