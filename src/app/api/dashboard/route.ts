// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🚀 Dashboard API called");
    
    const session = await auth();
    console.log("📋 Session:", session ? "Found" : "Not found");
    console.log("👤 User:", session?.user ? session.user : "No user");
    
    if (!session?.user?.id) {
      console.log("❌ No session or user ID");
      // Return dummy data for now to prevent crash
      return NextResponse.json({
        statusPengajuan: [],
        jadwalUjian: [],
        agenda: [],
        debug: "No session found"
      });
    }

    const { user } = session;
    console.log("🔐 User Role:", user.role);
    console.log("🆔 User ID:", user.id);

    let statusPengajuan: any[] = [];
    let jadwalUjian: any[] = [];
    let agenda: any[] = [];

    // For now, let's just test database connection
    try {
      const ujianCount = await prisma.ujian.count();
      console.log("📊 Total ujian in DB:", ujianCount);
    } catch (dbError) {
      console.log("❌ Database error:", dbError);
      return NextResponse.json({
        statusPengajuan: [],
        jadwalUjian: [],
        agenda: [],
        debug: "Database connection failed",
        error: dbError instanceof Error ? dbError.message : String(dbError)
      });
    }

    // Role-based dashboard data
    switch (user.role) {
      case 'MAHASISWA':
        console.log("📚 Fetching data for MAHASISWA");
        
        try {
          const mahasiswaUjian = await prisma.ujian.findMany({
            where: { mahasiswaId: user.id },
            include: {
              dosenPembimbing: { select: { name: true } },
              dosenPenguji: { 
                include: { 
                  dosen: { select: { name: true } } 
                } 
              }
            },
            orderBy: { createdAt: 'desc' }
          });

          console.log("📋 Found ujian for mahasiswa:", mahasiswaUjian.length);

          statusPengajuan = mahasiswaUjian.map(ujian => ({
            id: ujian.id,
            status: ujian.status,
            judul: ujian.judul,
            tanggal: ujian.jadwal,
            ruangUjian: ujian.jadwal ? 'Lab Software' : null
          }));

          jadwalUjian = mahasiswaUjian
            .filter(ujian => ujian.status === 'DIJADWALKAN' && ujian.jadwal)
            .map(ujian => ({
              id: ujian.id,
              judul: ujian.judul,
              tanggal: ujian.jadwal,
              dosenPembimbing: ujian.dosenPembimbing?.name || 'Tidak ada',
              status: ujian.status
            }));

        } catch (queryError) {
          console.log("❌ Query error for MAHASISWA:", queryError);
          // Return empty data instead of crashing
        }
        break;

      case 'DOSEN':
        console.log("👨‍🏫 Fetching data for DOSEN");
        
        try {
          const dosenUjian = await prisma.ujian.findMany({
            where: {
              OR: [
                { dosenPembimbingId: user.id },
                { dosenPenguji: { some: { dosenId: user.id } } }
              ]
            },
            include: {
              mahasiswa: { select: { name: true, nim: true } },
              dosenPembimbing: { select: { name: true } }
            },
            orderBy: { jadwal: 'asc' }
          });

          console.log("📋 Found ujian for dosen:", dosenUjian.length);

          statusPengajuan = dosenUjian.map(ujian => ({
            id: ujian.id,
            status: ujian.status,
            judul: ujian.judul,
            mahasiswa: ujian.mahasiswa?.name || 'Tidak ada',
            tanggal: ujian.jadwal
          }));

          jadwalUjian = dosenUjian.filter(ujian => ujian.jadwal);

        } catch (queryError) {
          console.log("❌ Query error for DOSEN:", queryError);
        }
        break;

      case 'ADMIN':
        console.log("👑 Fetching data for ADMIN");
        
        try {
          const allUjian = await prisma.ujian.findMany({
            include: {
              mahasiswa: { 
                select: { name: true, nim: true, prodi: true } 
              },
              dosenPembimbing: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
          });

          console.log("📋 Found total ujian:", allUjian.length);

          const stats = {
            menungguVerifikasi: allUjian.filter(u => u.status === 'MENUNGGU_VERIFIKASI').length,
            dijadwalkan: allUjian.filter(u => u.status === 'DIJADWALKAN').length,
            selesai: allUjian.filter(u => u.status === 'SELESAI').length,
            total: allUjian.length
          };

          statusPengajuan = [{
            ...stats,
            status: 'OVERVIEW',
            judul: 'Dashboard Overview'
          }];
          
          jadwalUjian = allUjian.filter(ujian => ujian.jadwal);

        } catch (queryError) {
          console.log("❌ Query error for ADMIN:", queryError);
        }
        break;

      default:
        console.log("❌ Invalid user role:", user.role);
        return NextResponse.json({
          statusPengajuan: [],
          jadwalUjian: [],
          agenda: [],
          debug: "Invalid user role"
        });
    }

    // Generate agenda (upcoming events)
    agenda = jadwalUjian
      .filter(ujian => ujian.tanggal && new Date(ujian.tanggal) >= new Date())
      .slice(0, 5)
      .map(ujian => ({
        date: ujian.tanggal,
        title: ujian.judul || 'Ujian Tugas Akhir',
        type: 'ujian'
      }));

    console.log("✅ Dashboard API success");
    console.log("📊 Results:", {
      statusPengajuan: statusPengajuan.length,
      jadwalUjian: jadwalUjian.length,
      agenda: agenda.length
    });

    return NextResponse.json({
      statusPengajuan,
      jadwalUjian,
      agenda,
      userRole: user.role,
      debug: "Success"
    });

  } catch (error) {
    console.error("💥 Dashboard API Error:", error);
    
    // Return safe fallback data
    return NextResponse.json({
      statusPengajuan: [],
      jadwalUjian: [],
      agenda: [],
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'Internal server error',
      debug: "Caught error"
    });
  }
}