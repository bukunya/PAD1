"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        Sign in with Google
      </button>
    </div>
  );
}
