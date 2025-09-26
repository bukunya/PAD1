import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">Your session details:</p>
        </div>
        <div className="mb-6">
          <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto border">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        <div className="flex justify-center mb-6">
          <Image
            src={session.user?.image || ""}
            alt="User Avatar"
            width={96}
            height={96}
            className="rounded-full border-4 border-indigo-200"
          />
        </div>
        <div className="text-center flex gap-4 flex-col sm:flex-row sm:justify-center">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit" className="mr-4">
              Sign Out
            </Button>
          </form>
          <Button variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
