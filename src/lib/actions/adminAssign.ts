"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "./googleCalendar";
import { createMultipleNotifications } from "./notifications";
import { formatNotificationMessage } from "@/lib/utils/notificationHelpers";

// Define the schema for admin assignment
const assignUjianSchema = z.object({
  ujianId: z.string().min(1, "ID Ujian tidak valid"),
  dosenPenguji1Id: z.string().min(1, "Dosen Penguji 1 wajib dipilih"),
  dosenPenguji2Id: z.string().min(1, "Dosen Penguji 2 wajib dipilih"),
  tanggalUjian: z.string().min(1, "Tanggal ujian wajib diisi"),
  jamMulai: z.string().min(1, "Jam mulai wajib diisi"),
  jamSelesai: z.string().min(1, "Jam selesai wajib diisi"),
  ruangan: z.string().min(1, "Ruangan wajib diisi"),
});

/**
 * Server action to get ujian details for admin assignment
 */
export async function getUjianDetails(ujianId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Anda harus login untuk mengakses halaman ini",
      };
    }

    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Akses ditolak. Hanya admin yang dapat mengakses halaman ini.",
      };
    }

    const ujian = await prisma.ujian.findUnique({
      where: { id: ujianId },
      select: {
        id: true,
        judul: true,
        berkasUrl: true,
        status: true,
        createdAt: true,
        mahasiswa: {
          select: {
            id: true,
            name: true,
            nim: true,
            prodi: true,
          },
        },
        dosenPembimbing: {
          select: {
            id: true,
            name: true,
          },
        },
        dosenPenguji: {
          select: {
            dosen: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tanggalUjian: true,
        jamMulai: true,
        jamSelesai: true,
        ruangan: true,
      },
    });

    if (!ujian) {
      return {
        success: false,
        error: "Ujian tidak ditemukan",
      };
    }

    return {
      success: true,
      data: ujian,
    };
  } catch (error) {
    console.error("Error fetching ujian details:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengambil data ujian",
    };
  }
}

/**
 * Server action to assign dosen penguji and schedule ujian
 */
export async function assignUjian(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Anda harus login untuk melakukan aksi ini",
      };
    }

    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Akses ditolak. Hanya admin yang dapat mengakses halaman ini.",
      };
    }

    // Extract form data
    const rawData = {
      ujianId: formData.get("ujianId") as string,
      dosenPenguji1Id: formData.get("dosenPenguji1") as string,
      dosenPenguji2Id: formData.get("dosenPenguji2") as string,
      tanggalUjian: formData.get("tanggalUjian") as string,
      jamMulai: formData.get("jamMulai") as string,
      jamSelesai: formData.get("jamSelesai") as string,
      ruangan: formData.get("ruangan") as string,
    };

    // Validate the input data
    const validationResult = assignUjianSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Data tidak valid",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const data = validationResult.data;

    // Check if two dosen penguji are different
    if (data.dosenPenguji1Id === data.dosenPenguji2Id) {
      return {
        success: false,
        error: "Dosen Penguji 1 dan Dosen Penguji 2 harus berbeda",
      };
    }

    // Check if ujian exists
    const ujian = await prisma.ujian.findUnique({
      where: { id: data.ujianId },
      include: {
        mahasiswa: {
          select: {
            email: true,
            name: true,
          },
        },
        dosenPembimbing: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!ujian) {
      return {
        success: false,
        error: "Ujian tidak ditemukan",
      };
    }

    // Combine date and time
    const tanggalUjian = new Date(data.tanggalUjian);
    const [jamMulaiHour, jamMulaiMinute] = data.jamMulai.split(":");
    const [jamSelesaiHour, jamSelesaiMinute] = data.jamSelesai.split(":");

    const jamMulai = new Date(tanggalUjian);
    jamMulai.setHours(parseInt(jamMulaiHour), parseInt(jamMulaiMinute));

    const jamSelesai = new Date(tanggalUjian);
    jamSelesai.setHours(parseInt(jamSelesaiHour), parseInt(jamSelesaiMinute));

    // Validate time logic
    if (jamSelesai <= jamMulai) {
      return {
        success: false,
        error: "Jam selesai harus lebih besar dari jam mulai",
      };
    }

    // Fetch dosen penguji details for calendar event
    const dosenPenguji1 = await prisma.user.findUnique({
      where: { id: data.dosenPenguji1Id },
      select: { email: true, name: true },
    });

    const dosenPenguji2 = await prisma.user.findUnique({
      where: { id: data.dosenPenguji2Id },
      select: { email: true, name: true },
    });

    if (!dosenPenguji1 || !dosenPenguji2) {
      return {
        success: false,
        error: "Dosen penguji tidak ditemukan",
      };
    }

    // Prepare calendar event data
    const attendeeEmails: string[] = [];

    // Add mahasiswa email
    if (ujian.mahasiswa.email) {
      attendeeEmails.push(ujian.mahasiswa.email);
    }

    // Add dosen pembimbing email
    if (ujian.dosenPembimbing.email) {
      attendeeEmails.push(ujian.dosenPembimbing.email);
    }

    // Add dosen penguji emails
    if (dosenPenguji1.email) {
      attendeeEmails.push(dosenPenguji1.email);
    }
    if (dosenPenguji2.email) {
      attendeeEmails.push(dosenPenguji2.email);
    }

    // Format description: "SIMPENSI - [Judul Tugas Akhir] - [Ruangan] - [Pembimbing/Penguji]"
    const description = `SIMPENSI - ${ujian.judul} - ${
      data.ruangan
    } - Pembimbing: ${ujian.dosenPembimbing.name || "N/A"} / Penguji: ${
      dosenPenguji1.name || "N/A"
    }, ${dosenPenguji2.name || "N/A"}`;

    let calendarEventId = ujian.googleCalendarEventId;
    let calendarResult;

    // Create or update Google Calendar event
    if (calendarEventId) {
      // Update existing event
      calendarResult = await updateCalendarEvent(calendarEventId, {
        summary: `Ujian TA - ${ujian.mahasiswa.name}`,
        description: description,
        location: data.ruangan,
        startDateTime: jamMulai.toISOString(),
        endDateTime: jamSelesai.toISOString(),
        attendees: attendeeEmails,
      });
    } else {
      // Create new event
      calendarResult = await createCalendarEvent({
        summary: `Ujian TA - ${ujian.mahasiswa.name}`,
        description: description,
        location: data.ruangan,
        startDateTime: jamMulai.toISOString(),
        endDateTime: jamSelesai.toISOString(),
        attendees: attendeeEmails,
      });

      if (calendarResult.success && calendarResult.eventId) {
        calendarEventId = calendarResult.eventId;
      }
    }

    // Log calendar result (optional, for debugging)
    if (!calendarResult.success) {
      console.warn(
        "Failed to create/update calendar event:",
        calendarResult.error
      );
      // Continue with the database update even if calendar fails
    }

    // Check if this is a new schedule or an update
    const isNewSchedule = ujian.status !== "DIJADWALKAN";

    // Update ujian and assign dosen penguji in a transaction
    await prisma.$transaction(async (tx) => {
      // Update ujian with schedule and calendar event ID
      await tx.ujian.update({
        where: { id: data.ujianId },
        data: {
          status: "DIJADWALKAN",
          tanggalUjian: tanggalUjian,
          jamMulai: jamMulai,
          jamSelesai: jamSelesai,
          ruangan: data.ruangan,
          googleCalendarEventId: calendarEventId,
          updatedAt: new Date(),
        },
      });

      // Delete existing dosen penguji assignments (if any)
      await tx.ujianDosenPenguji.deleteMany({
        where: { ujianId: data.ujianId },
      });

      // Create new dosen penguji assignments
      await tx.ujianDosenPenguji.createMany({
        data: [
          {
            ujianId: data.ujianId,
            dosenId: data.dosenPenguji1Id,
          },
          {
            ujianId: data.ujianId,
            dosenId: data.dosenPenguji2Id,
          },
        ],
      });
    });

    // Create notifications
    const notifications = [];

    if (isNewSchedule) {
      // New schedule - notify mahasiswa, dosen pembimbing, and both penguji
      notifications.push({
        userId: ujian.mahasiswaId,
        ujianId: data.ujianId,
        message: formatNotificationMessage(
          "Ujian telah dijadwalkan oleh admin prodi",
          tanggalUjian,
          jamMulai
        ),
      });

      notifications.push({
        userId: ujian.dosenPembimbingId,
        ujianId: data.ujianId,
        message: formatNotificationMessage(
          `Pengajuan oleh ${ujian.mahasiswa.name || "mahasiswa"} sudah dijadwalkan`,
          tanggalUjian,
          jamMulai
        ),
      });

      notifications.push({
        userId: data.dosenPenguji1Id,
        ujianId: data.ujianId,
        message: formatNotificationMessage(
          `Pengajuan oleh ${ujian.mahasiswa.name || "mahasiswa"} sudah dijadwalkan`,
          tanggalUjian,
          jamMulai
        ),
      });

      notifications.push({
        userId: data.dosenPenguji2Id,
        ujianId: data.ujianId,
        message: formatNotificationMessage(
          `Pengajuan oleh ${ujian.mahasiswa.name || "mahasiswa"} sudah dijadwalkan`,
          tanggalUjian,
          jamMulai
        ),
      });
    } else {
      // Schedule updated - notify dosen pembimbing and both penguji (not mahasiswa)
      const newDate = tanggalUjian.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      notifications.push({
        userId: ujian.dosenPembimbingId,
        ujianId: data.ujianId,
        message: formatNotificationMessage(
          `Jadwal ujian ${ujian.mahasiswa.name || "mahasiswa"} diubah ke ${newDate}`,
          tanggalUjian,
          jamMulai
        ),
      });

      notifications.push({
        userId: data.dosenPenguji1Id,
        ujianId: data.ujianId,
        message: formatNotificationMessage(
          `Jadwal ujian ${ujian.mahasiswa.name || "mahasiswa"} diubah ke ${newDate}`,
          tanggalUjian,
          jamMulai
        ),
      });

      notifications.push({
        userId: data.dosenPenguji2Id,
        ujianId: data.ujianId,
        message: formatNotificationMessage(
          `Jadwal ujian ${ujian.mahasiswa.name || "mahasiswa"} diubah ke ${newDate}`,
          tanggalUjian,
          jamMulai
        ),
      });
    }

    await createMultipleNotifications(notifications);

    // Revalidate relevant pages
    revalidatePath("/detail-jadwal");
    revalidatePath(`/admin-assign/${data.ujianId}`);

    // Build success message
    let successMessage =
      "Ujian berhasil dijadwalkan dan dosen penguji berhasil ditugaskan";
    if (calendarResult.success) {
      successMessage +=
        ". Event kalender telah dibuat/diperbarui dan undangan dikirim ke semua peserta.";
    } else if (calendarResult.needsReauth) {
      successMessage +=
        ". Namun, event kalender gagal dibuat. Silakan sign out dan sign in kembali untuk menyambungkan Google Calendar.";
    } else {
      successMessage +=
        ". Namun, event kalender gagal dibuat: " +
        (calendarResult.error || "Unknown error");
    }

    return {
      success: true,
      message: successMessage,
      calendarEventLink: calendarResult.success
        ? calendarResult.htmlLink
        : undefined,
    };
  } catch (error) {
    console.error("Error assigning ujian:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menjadwalkan ujian",
    };
  }
}
