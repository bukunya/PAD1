import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function APIDocumentationPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">API Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Server Actions Reference for Exam Management System
          </p>
        </div>

        {/* Table of Contents */}
        <Card>
          <CardHeader>
            <CardTitle>Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2">
              <a
                href="#authentication"
                className="text-blue-600 hover:underline"
              >
                1. Authentication
              </a>
              <a href="#dashboard" className="text-blue-600 hover:underline">
                2. Dashboard
              </a>
              <a href="#profile" className="text-blue-600 hover:underline">
                3. Profile Management
              </a>
              <a href="#ujian" className="text-blue-600 hover:underline">
                4. Ujian (Exam) Management
              </a>
              <a href="#admin" className="text-blue-600 hover:underline">
                5. Admin Operations
              </a>
              <a
                href="#notifications"
                className="text-blue-600 hover:underline"
              >
                6. Notifications
              </a>
              <a href="#calendar" className="text-blue-600 hover:underline">
                7. Google Calendar Integration
              </a>
              <a href="#statistics" className="text-blue-600 hover:underline">
                8. Statistics
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <section id="authentication">
          <h2 className="text-3xl font-bold mb-4">1. Authentication</h2>
          <p className="text-muted-foreground mb-4">
            All endpoints require authentication via NextAuth session. Access is
            role-based (MAHASISWA, DOSEN, ADMIN).
          </p>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  Standard Return Format
                </CardTitle>
                <Badge>All Endpoints</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                {`{
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Dashboard */}
        <section id="dashboard" className="space-y-4">
          <h2 className="text-3xl font-bold">2. Dashboard</h2>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>dashboardTop()</CardTitle>
                <Badge variant="outline">MAHASISWA | DOSEN | ADMIN</Badge>
              </div>
              <CardDescription>
                Get upcoming exams (current month + 2 months ahead)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Import</h4>
                <code className="bg-muted px-2 py-1 rounded">
                  {`import { dashboardTop } from '@/lib/actions/dashboard/dashboardTop'`}
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`const result = await dashboardTop();

// MAHASISWA returns:
{
  success: true,
  data: [{ id, ruangan, tanggal }],
  statusPengajuan: "MENUNGGU_VERIFIKASI" | "DITERIMA" | etc.
}

// DOSEN returns:
{
  success: true,
  data: [{ id, tanggal, ruangan }],
  jumlahMahasiswaBimbingan: number
}

// ADMIN returns:
{
  success: true,
  data: [{ id, namaMahasiswa, nim, foto, ruangan, tanggal }],
  jumlahMahasiswa: number,
  jumlahDosen: number
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>dashBottom()</CardTitle>
                <Badge variant="outline">MAHASISWA | DOSEN | ADMIN</Badge>
              </div>
              <CardDescription>Get 5 most recent exams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Import</h4>
                <code className="bg-muted px-2 py-1 rounded">
                  {`import { dashBottom } from '@/lib/actions/dashboard/dashBottom'`}
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`const result = await dashBottom();
// Returns max 5 most recent items based on role`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Profile Management */}
        <section id="profile" className="space-y-4">
          <h2 className="text-3xl font-bold">3. Profile Management</h2>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>getUserProfile()</CardTitle>
                <Badge variant="outline">All Roles</Badge>
              </div>
              <CardDescription>Get current user's profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Import</h4>
                <code className="bg-muted px-2 py-1 rounded">
                  {`import { getUserProfile } from '@/lib/actions/profile/profile'`}
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`const result = await getUserProfile();
// Returns: { success, data: { id, name, email, role, ... } }`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>updateProfile(formData)</CardTitle>
                <Badge variant="outline">All Roles</Badge>
              </div>
              <CardDescription>Update current user's profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Parameters</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`formData: FormData {
  name?: string;
  telepon?: string;
  // MAHASISWA only:
  nim?: string;
  prodi?: Prodi;
  dosenPembimbingId?: string;
  // DOSEN only:
  departemen?: string;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>getMahasiswaProfile(userId)</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>
                Get mahasiswa profile by ID (admin only)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Import</h4>
                <code className="bg-muted px-2 py-1 rounded">
                  {`import { getMahasiswaProfile } from '@/lib/actions/profile/adminEditMahasiswaProfile'`}
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`const result = await getMahasiswaProfile(userId);
// Returns: { success, data: { name, nim, prodi, ... } }`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>
                  updateMahasiswaProfileByAdmin(userId, formData)
                </CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>
                Update mahasiswa profile (admin only)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Parameters</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`userId: string
formData: FormData {
  name?: string;
  nim?: string;
  prodi?: Prodi;
  telepon?: string;
  dosenPembimbingId?: string;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>getDosenProfile(userId)</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded">
                {`import { getDosenProfile } from '@/lib/actions/profile/adminEditDosenProfile'`}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>
                  updateDosenProfileByAdmin(userId, formData)
                </CardTitle>
                <Badge>ADMIN</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                {`formData: FormData {
  name?: string;
  departemen?: string;
  telepon?: string;
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>getDosenName()</CardTitle>
                <Badge variant="outline">All Roles</Badge>
              </div>
              <CardDescription>
                Get list of all dosen for dropdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded">
                {`import { getDosenName } from '@/lib/actions/profile/getDosenName'`}
              </code>
            </CardContent>
          </Card>
        </section>

        {/* Ujian Management */}
        <section id="ujian" className="space-y-4">
          <h2 className="text-3xl font-bold">4. Ujian (Exam) Management</h2>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>submitBerkas(formData)</CardTitle>
                <Badge>MAHASISWA</Badge>
              </div>
              <CardDescription>
                Submit exam registration (file upload to Supabase)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Import</h4>
                <code className="bg-muted px-2 py-1 rounded">
                  {`import { submitBerkas } from '@/lib/actions/formPengajuan/uploadBerkasSupabase'`}
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Parameters</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`formData: FormData {
  judul: string;
  berkas: File;  // PDF file
  dosenPembimbingId: string;
}`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Returns</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`{
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: { [key: string]: string[] };
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>DataProfile()</CardTitle>
                <Badge>MAHASISWA</Badge>
              </div>
              <CardDescription>
                Get data needed for form pengajuan (dosen list, user info)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded">
                {`import { DataProfile } from '@/lib/actions/formPengajuan/dataProfile'`}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>riwayatUjian(params)</CardTitle>
                <Badge variant="outline">DOSEN | ADMIN</Badge>
              </div>
              <CardDescription>
                Get exam history with pagination and filters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Import</h4>
                <code className="bg-muted px-2 py-1 rounded">
                  {`import { riwayatUjian } from '@/lib/actions/riwayatUjian/riwayatUjian'`}
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Parameters</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`params?: {
  page?: number;          // Default: 1
  limit?: number;         // Default: 10
  month?: number;         // 1-12
  year?: number;          // e.g., 2025
  peran?: "pembimbing" | "penguji" | "semua";  // DOSEN only
}`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Example</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`// Get page 2, November 2025, as pembimbing
const result = await riwayatUjian({
  page: 2,
  limit: 20,
  month: 11,
  year: 2025,
  peran: "pembimbing"
});`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>detailJadwal()</CardTitle>
                <Badge variant="outline">DOSEN | ADMIN</Badge>
              </div>
              <CardDescription>
                Get scheduled exams with details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded">
                {`import { detailJadwal } from '@/lib/actions/detailJadwal/detailJadwal'`}
              </code>
            </CardContent>
          </Card>
        </section>

        {/* Admin Operations */}
        <section id="admin" className="space-y-4">
          <h2 className="text-3xl font-bold">5. Admin Operations</h2>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>manajemenPengajuanFormPendaftaran(params)</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>
                Manage exam submissions with pagination and status filter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Import</h4>
                <code className="bg-muted px-2 py-1 rounded">
                  {`import { manajemenPengajuanFormPendaftaran } from '@/lib/actions/manajemenPengajuanFormPendaftaran/manajemenPengajuanFormPendaftaran'`}
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Parameters</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`params?: {
  page?: number;          // Default: 1
  limit?: number;         // Default: 10
  status?: StatusUjian;   // Filter by status
}

// StatusUjian enum:
// "MENUNGGU_VERIFIKASI" | "DITERIMA" | "DITOLAK" | "DIJADWALKAN" | "SELESAI"`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>getUjianForReview(ujianId)</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>Get ujian details for review</CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded">
                {`import { getUjianForReview } from '@/lib/actions/adminAssignUjian/adminTerimaTolakUjian'`}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>acceptUjian(ujianId)</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>
                Accept ujian submission (change status to DITERIMA)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                {`const result = await acceptUjian(ujianId);
// Creates notification for mahasiswa and dosen pembimbing`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>rejectUjian(ujianId, komentarAdmin?)</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>
                Reject ujian submission (change status to DITOLAK)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                {`const result = await rejectUjian(ujianId, "Alasan penolakan...");
// Creates notification for mahasiswa`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>getAllDosen()</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>Get all dosen for assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded">
                {`import { getAllDosen } from '@/lib/actions/adminAssignUjian/adminJadwalin'`}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>getUjianDetails(ujianId)</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>
                Get ujian details for scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded">
                {`import { getUjianDetails } from '@/lib/actions/adminAssignUjian/adminJadwalin'`}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>
                  getAvailableDosen(tanggalUjian, jamMulai, jamSelesai)
                </CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>
                Check dosen availability for specific time slot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                {`const result = await getAvailableDosen(
  "2025-11-15",
  "09:00",
  "11:00"
);
// Returns list of available dosen (not already scheduled)`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>assignUjian(formData)</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>
                Schedule ujian with dosen penguji and create Google Calendar
                event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Parameters</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`formData: FormData {
  ujianId: string;
  tanggalUjian: string;   // YYYY-MM-DD
  jamMulai: string;       // HH:MM
  jamSelesai: string;     // HH:MM
  ruangan: string;
  dosenPenguji1Id: string;
  dosenPenguji2Id: string;
}`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Features</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Validates dosen availability</li>
                  <li>Creates Google Calendar event for all participants</li>
                  <li>Sends notifications to mahasiswa and all dosen</li>
                  <li>Changes status to DIJADWALKAN</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Notifications */}
        <section id="notifications" className="space-y-4">
          <h2 className="text-3xl font-bold">6. Notifications</h2>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>getNotifications(page, limit)</CardTitle>
                <Badge variant="outline">All Roles</Badge>
              </div>
              <CardDescription>
                Get user's notifications with pagination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Import</h4>
                <code className="bg-muted px-2 py-1 rounded">
                  {`import { getNotifications } from '@/lib/actions/notifikasi/notifications'`}
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`const result = await getNotifications(1, 10);
// Returns paginated notifications sorted by newest first`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>
                  createNotification(userId, ujianId, message)
                </CardTitle>
                <Badge variant="secondary">Internal</Badge>
              </div>
              <CardDescription>
                Create a single notification (used internally by other actions)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                {`await createNotification(
  userId,
  ujianId,
  "Ujian Anda telah diterima"
);`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>
                  createMultipleNotifications(notifications[])
                </CardTitle>
                <Badge variant="secondary">Internal</Badge>
              </div>
              <CardDescription>
                Create multiple notifications at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                {`await createMultipleNotifications([
  { userId: "id1", ujianId: "ujian1", message: "..." },
  { userId: "id2", ujianId: "ujian1", message: "..." }
]);`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Google Calendar */}
        <section id="calendar" className="space-y-4">
          <h2 className="text-3xl font-bold">7. Google Calendar Integration</h2>

          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Automatic event creation with timezone handling (Asia/Jakarta)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All calendar functions automatically convert UTC times to
                Jakarta timezone (WIB/UTC+7). Events are created with email
                reminders (1 day before) and popup reminders (30 minutes
                before).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>checkCalendarAccess()</CardTitle>
                <Badge variant="outline">All Roles</Badge>
              </div>
              <CardDescription>
                Check if user has valid Google Calendar access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded">
                {`import { checkCalendarAccess } from '@/lib/actions/googleCalendar/googleCalendar'`}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>createCalendarEvent(eventData)</CardTitle>
                <Badge variant="outline">All Roles</Badge>
              </div>
              <CardDescription>Create a Google Calendar event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Parameters</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`eventData: {
  summary: string;          // Event title
  description?: string;     // Event description
  location?: string;        // Room/location
  startDateTime: string;    // ISO 8601 format (UTC)
  endDateTime: string;      // ISO 8601 format (UTC)
  attendees?: string[];     // Email addresses
}`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Example</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`const result = await createCalendarEvent({
  summary: "Ujian TA - John Doe",
  description: "Sidang Tugas Akhir",
  location: "Ruang 301",
  startDateTime: "2025-11-15T09:00:00.000Z",
  endDateTime: "2025-11-15T11:00:00.000Z",
  attendees: ["dosen1@email.com", "dosen2@email.com"]
});
// Automatically converts to WIB timezone
// Creates event at 9:00 AM WIB (not 4:00 PM)`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Returns</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  {`{
  success: boolean;
  eventId?: string;        // Google Calendar event ID
  htmlLink?: string;       // Link to view event
  message?: string;
  error?: string;
  needsReauth?: boolean;   // If true, user needs to re-login
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>updateCalendarEvent(eventId, eventData)</CardTitle>
                <Badge variant="outline">All Roles</Badge>
              </div>
              <CardDescription>
                Update an existing Google Calendar event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                {`const result = await updateCalendarEvent(eventId, {
  startDateTime: "2025-11-15T10:00:00.000Z",
  endDateTime: "2025-11-15T12:00:00.000Z",
  ruangan: "Ruang 302"
});
// Sends update notifications to all attendees`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>deleteCalendarEvent(eventId)</CardTitle>
                <Badge variant="outline">All Roles</Badge>
              </div>
              <CardDescription>Delete a Google Calendar event</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                {`const result = await deleteCalendarEvent(eventId);
// Sends cancellation notifications to all attendees`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Statistics */}
        <section id="statistics" className="space-y-4">
          <h2 className="text-3xl font-bold">8. Statistics</h2>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>statistikMahasiswa()</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>Get mahasiswa statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded">
                {`import { statistikMahasiswa } from '@/lib/actions/statistikDataMhsDsn/statistikMhs'`}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>statistikDosen()</CardTitle>
                <Badge>ADMIN</Badge>
              </div>
              <CardDescription>Get dosen statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded">
                {`import { statistikDosen } from '@/lib/actions/statistikDataMhsDsn/statistikDsn'`}
              </code>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <a href="/dev" className="text-blue-600 hover:underline">
                  → Dev Testing Pages
                </a>
                {" - "}
                <span className="text-sm text-muted-foreground">
                  Test all pagination and filtering features
                </span>
              </li>
              <li>
                <span className="text-blue-600">→ ADVANCED_FEATURES.md</span>
                {" - "}
                <span className="text-sm text-muted-foreground">
                  Caching, audit logging, rate limiting, database indexes
                </span>
              </li>
              <li>
                <span className="text-blue-600">→ DEV_PAGES_GUIDE.md</span>
                {" - "}
                <span className="text-sm text-muted-foreground">
                  Complete guide to dev testing pages
                </span>
              </li>
              <li>
                <span className="text-blue-600">→ BACKEND_ANALYSIS.md</span>
                {" - "}
                <span className="text-sm text-muted-foreground">
                  Comprehensive backend analysis
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
