"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Save, PenTool } from "lucide-react";
import { Prodi } from "@/generated/prisma"; // enum dari Prisma

export function Profile() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    fakultas: "Sekolah Vokasi",
    prodi: "" as Prodi | "",
    email: "",
    telepon: "",
    image: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      }));
    }
  }, [session]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Simpan perubahan:", Profile);
    // TODO: panggil API untuk update ke database
  };

  const handleChangePhoto = () => {
    console.log("Ganti foto profil");
    // TODO: implementasi upload photo
  };

  return (
    <div className="space-y-6">
  <h2 className="text-xl font-semibold text-gray-800">Profil Mahasiswa</h2>

  {/* Grid Profil */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    {/* Foto Profil (Kolom 3, row-span 3 untuk merge ke bawah) */}
    <div className="flex flex-col items-center justify-center 
                  md:col-span-2 
                  lg:col-span-1 lg:row-span-3 lg:col-start-3 lg:row-start-1
                  min-h-[200px] lg:min-h-full">
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-lg bg-blue-500 text-white flex items-center justify-center text-3xl font-bold">
        D
      </div>
      <Button variant="outline" size="sm" className="mt-2">
        Ganti Foto
      </Button>
    </div>

    {/* Nama */}
    <div>
      <Label>Nama Lengkap</Label>
      <Input defaultValue="Dimas Satria Widjatmiko" />
    </div>

    {/* NIM */}
    <div>
      <Label>NIM</Label>
      <Input defaultValue="22/123456/SV/54321" />
    </div>

    {/* Fakultas */}
    <div>
      <Label>Fakultas</Label>
      <Input defaultValue="Sekolah Vokasi" disabled />
    </div>

    {/* Prodi */}
    <div className="space-y-2">
      <Label htmlFor="prodi">Program Studi</Label>
      <Select
        value={formData.prodi}
        onValueChange={(value) => handleChange("prodi", value)}
      >
        <SelectTrigger id="prodi">
          <SelectValue placeholder="Pilih Program Studi" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(Prodi).map((prodi) => (
            <SelectItem key={prodi} value={prodi}>
              {prodi}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Email */}
    <div>
      <Label>Email</Label>
      <Input defaultValue="dimassatriawidjatmiko@mail.ugm.ac.id" disabled />
    </div>

    {/* Telepon */}
    <div>
      <Label>No. Telepon</Label>
      <Input defaultValue="08123456789" />
    </div>
  </div>

  {/* Actions */}
  <div className="flex gap-4">
    <Button>
      <Save className="mr-2 h-4 w-4" />
      Simpan Perubahan
    </Button>
  </div>
</div>
  );
}
