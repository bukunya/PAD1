"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { data: session } = useSession();
  
  if (!session) {
    return null;
  }

  const getRoleLabel = (role?: string) => {
    if (!role) return "User";
    const roleMap: Record<string, string> = {
      MAHASISWA: "Mahasiswa",
      DOSEN: "Dosen",
      ADMIN: "Admin Prodi",
    };
    return roleMap[role] || role;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar className="h-10 w-10 rounded-full border-2 border-gray-200">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="rounded-full bg-blue-100 text-blue-600">
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">
          {user.name}
        </span>
        <span className="text-xs text-gray-500">
          {getRoleLabel(session.user?.role)}
        </span>
      </div>
    </div>
  );
}