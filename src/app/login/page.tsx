import { LoginForm } from "@/components/login-form"

<<<<<<< Updated upstream
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
=======
import { signIn } from "next-auth/react";
import { useState } from "react";
import { LogIn, Shield, BookOpen, Users } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Left Side - Branding & Info */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                {/* Logo/Brand */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">SIMPENSI</h1>
                      <p className="text-blue-100 text-sm">Sekolah Vokasi UGM</p>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-3">
                      Sistem Penjadwalan
                      <span className="block text-blue-200">Ujian Tugas Akhir</span>
                    </h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      Kelola jadwal ujian tugas akhir dengan mudah dan efisien. 
                      Platform terintegrasi untuk mahasiswa dan dosen.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="text-blue-100">Pengajuan ujian online</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-blue-100">Koordinasi dosen pembimbing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className="text-blue-100">Akses aman dengan akun UGM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Masuk ke SIMPENSI
                  </h2>
                  <p className="text-gray-600">
                    Gunakan akun UGM Anda untuk melanjutkan
                  </p>
                </div>

                {/* Login Card */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <LogIn className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Single Sign-On
                    </h3>
                    <p className="text-sm text-gray-600">
                      Masuk dengan akun Google UGM Anda
                    </p>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Menghubungkan...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="group-hover:text-blue-600 transition-colors">
                          Masuk dengan Google UGM
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Domain Info */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-4">
                    Hanya akun dengan domain <span className="font-semibold text-blue-600">@ugm.ac.id</span> dan <span className="font-semibold text-blue-600">@mail.ugm.ac.id</span> yang dapat mengakses sistem
                  </p>
                  
                  {/* Footer */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-400">
                      © 2025 SIMPENSI - Software Engineering Sekolah Vokasi UGM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
>>>>>>> Stashed changes
