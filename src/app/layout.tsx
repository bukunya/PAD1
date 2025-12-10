import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIMPENSI - Sistem Informasi Penjadwalan Sidang",
  description: "Sistem Informasi Penjadwalan Sidang Tugas Akhir",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ambil session di server side
  const session = await auth();
  
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}