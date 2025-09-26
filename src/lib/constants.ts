import { profile } from "console";

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
  { id: 'form-pengajuan', label: 'Form Pengajuan', icon: 'FileText', href: '/form-pengajuan' },
  { id: 'riwayat-pengajuan', label: 'Riwayat Pengajuan', icon: 'Clock', href: '/riwayat-pengajuan' },
  { id: 'detail-jadwal', label: 'Detail Jadwal', icon: 'Calendar', href: '/detail-jadwal' },
  { id: 'profile', label: 'Profile', icon: 'User', href: '/profile' },
] as const;

export const STATUS_COLORS = {
  pending: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500'
} as const;