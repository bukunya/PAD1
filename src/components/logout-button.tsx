"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      console.log("🚪 Starting logout...");

      // STEP 1: NextAuth's signOut (clear React session)
      await signOut({ 
        redirect: false,
        callbackUrl: "/login"
      });

      console.log("✅ NextAuth signOut done");

      // STEP 2: Call nuclear endpoint (clear cookies)
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      console.log("✅ Server cleanup done");

      // STEP 3: Clear storage
      localStorage.clear();
      sessionStorage.clear();

      // STEP 4: Force reload
      window.location.replace("/login");
      
    } catch (error) {
      console.error("❌ Logout failed:", error);
      window.location.replace("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}