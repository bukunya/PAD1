"use client";

import { getFormPengajuanProfile } from "@/lib/actions/formPengajuan";
import { AlertCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";

const FpTop = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{
    id: string;
    name: string | null;
    nim: string | null;
    prodi: string | null;
    departemen: string | null;
    dosenPembimbingId: string | null;
    dosenPembimbing: string | null;
  } | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (status === "loading") return;

      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getFormPengajuanProfile();
        if (profile) {
          setUserData({
            ...profile,
            dosenPembimbing: profile.dosenPembimbing?.name || null,
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setMessage({ type: "error", text: "Gagal memuat data profil" });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [session, status]);
  // Show loading state while checking authentication
  if (status === "loading" || isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!session?.user) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Anda harus login untuk mengakses halaman profil.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <>
      <div className="gap-8">
        {/* Main User Data Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Profil</CardTitle>
            </CardHeader>
            <div>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input
                    id="nama"
                    name="name"
                    value={userData?.name || ""}
                    disabled
                  />
                </div>

                {/* NIM Field */}
                <div className="space-y-2">
                  <Label>NIM</Label>
                  <Input
                    id="nim"
                    name="nim"
                    value={userData?.nim || ""}
                    disabled
                  />
                </div>

                {/* Program Studi Field */}
                <div className="space-y-2">
                  <Label>Angkatan</Label>
                  <Input
                    id="angkatan"
                    name="angkatan"
                    value={userData?.nim?.slice(0, 2) || ""}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prodi</Label>
                  <Input
                    id="prodi"
                    name="prodi"
                    value={userData?.prodi || ""}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dosen Pembimbing</Label>
                  <Input
                    id="dosenPembimbing"
                    name="dosenPembimbing"
                    value={userData?.dosenPembimbing || ""}
                    disabled
                  />
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FpTop;
