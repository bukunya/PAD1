import { signOut } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  cookieStore.delete("authjs.session-token");
  cookieStore.delete("authjs.callback-url");
  cookieStore.delete("authjs.csrf-token");
  cookieStore.delete("__Secure-authjs.session-token");
  cookieStore.delete("__Secure-authjs.callback-url");
  cookieStore.delete("__Secure-authjs.csrf-token");

  await signOut({ redirect: false });

  return NextResponse.redirect(
    new URL("/login", process.env.NEXTAUTH_URL || window.location.hostname)
  );
}
