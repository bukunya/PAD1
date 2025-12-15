"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const nukeAllCookies = () => {
    // Get all cookies
    const cookies = document.cookie.split(";");
    
    // Delete each cookie
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Delete with multiple combinations
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure`;
    }
    
    console.log("💣 All cookies nuked");
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      console.log("🚪 Starting nuclear logout...");

      // STEP 1: Nuke all cookies client-side
      nukeAllCookies();

      // STEP 2: Server cleanup
      try {
        await fetch("/api/logout", {
          method: "GET",
          credentials: "include",
        });
        console.log("✅ Server cleanup done");
      } catch {
        console.log("⚠️ Server cleanup failed, continuing anyway");
      }

      // STEP 3: NextAuth signOut
      try {
        await signOut({ 
          redirect: false,
          callbackUrl: "/login"
        });
        console.log("✅ NextAuth signOut done");
      } catch {
        console.log("⚠️ NextAuth signOut failed, continuing anyway");
      }

      // STEP 4: Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // STEP 5: Nuclear reload
      console.log("💥 Nuclear reload...");
      
      // Clear browser cache
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => caches.delete(name));
        });
      }
      
      // Force reload from server
      window.location.href = "/login?t=" + Date.now();
      
    } catch (error) {
      console.error("❌ Logout failed:", error);
      // Even on error, nuke everything and reload
      nukeAllCookies();
      window.location.href = "/login?t=" + Date.now();
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