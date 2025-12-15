"use server";

import { prisma } from "@/lib/prisma";

export const hapusDataMhs = async (id: string) => {
  try {
    await prisma.ujianDosenPenguji.deleteMany({
      where: {
        ujian: {
          mahasiswaId: id,
        },
      },
    });

    await prisma.ujian.deleteMany({
      where: {
        mahasiswaId: id,
      },
    });

    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return { success: true, data: user };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error };
  }
};

export const hapusDataDsn = async (id: string) => {
  try {
    await prisma.ujianDosenPenguji.deleteMany({
      where: {
        dosenId: id,
      },
    });

    await prisma.user.updateMany({
      where: {
        dosenPembimbingId: id,
      },
      data: {
        dosenPembimbingId: null,
      },
    });

    await prisma.ujian.deleteMany({
      where: {
        dosenPembimbingId: id,
      },
    });

    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return { success: true, data: user };
  } catch (error) {
    console.error("Error deleting dosen:", error);
    return { success: false, error };
  }
};
