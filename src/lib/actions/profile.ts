"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define the schema for profile updates
const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Nama tidak boleh kosong")
    .max(100, "Nama terlalu panjang"),
  nim: z.string().optional(),
  prodi: z
    .enum([
      "TeknologiRekayasaPerangkatLunak",
      "TeknologiRekayasaElektro",
      "TeknologiRekayasaInternet",
      "TeknologiRekayasaInstrumentasiDanKontrol",
    ])
    .optional(),
  telepon: z
    .string()
    .regex(/^(\+62|62|0)[8-9][0-9]{7,11}$/, "Format nomor telepon tidak valid")
    .optional()
    .or(z.literal("")),
  dosenPembimbingId: z.string().optional(),
});

/**
 * Server action to update user profile
 * This action validates input, checks authentication, and updates the user profile
 */
export async function updateProfile(formData: FormData) {
  try {
    // Get the current session
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Anda harus login untuk mengupdate profil",
      };
    }

    // Extract form data
    const rawData = {
      name: formData.get("name") as string,
      nim: formData.get("nim") as string,
      prodi: formData.get("prodi") as string,
      telepon: formData.get("telepon") as string,
      dosenPembimbingId: formData.get("dosenPembimbingId") as string,
    };

    // Validate the input data
    const validationResult = updateProfileSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Data tidak valid",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const data = validationResult.data;

    // Check if NIM is already taken by another user (if provided)
    if (data.nim) {
      const existingUser = await prisma.user.findUnique({
        where: { nim: data.nim },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return {
          success: false,
          error: "NIM sudah digunakan oleh pengguna lain",
        };
      }
    }

    // Update the user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        nim: data.nim || null,
        prodi: data.prodi || null,
        telepon: data.telepon || null,
        updatedAt: new Date(),
        dosenPembimbingId: data.dosenPembimbingId || null,
      },
    });

    // Revalidate the profile page to show updated data
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profil berhasil diperbarui",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat memperbarui profil",
    };
  }
}

/**
 * Server action to get current user profile data
 * This is used to pre-populate the form with existing data
 */
export async function getUserProfile() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        nim: true,
        prodi: true,
        departemen: true,
        telepon: true,
        createdAt: true,
        updatedAt: true,
        dosenPembimbingId: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
