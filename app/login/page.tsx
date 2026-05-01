import Link from 'next/link'
import { login, signup } from './actions'
import { Compass, Mail, Lock, ArrowLeft, ArrowRight } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <div className="min-h-screen w-full flex bg-brand relative overflow-hidden">

      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

      <div className="flex-1 flex flex-col justify-center items-center w-full px-4 relative z-10">
        

        <Link
          href="/"
          className="absolute top-8 left-4 md:left-8 flex items-center text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>


        <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 relative overflow-hidden">

          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand via-emerald-400 to-teal-500"></div>

          <div className="flex flex-col items-center justify-center mb-10 mt-2">
            <div className="w-16 h-16 bg-emerald-50 text-brand rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
              <Compass className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">NyuVenture</h1>
            <p className="text-sm text-gray-500 mt-2 text-center">Masuk ke akun Anda untuk melanjutkan petualangan</p>
          </div>

          <form className="flex-1 flex flex-col w-full gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1" htmlFor="email">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none"
                  name="email"
                  placeholder="anda@email.com"
                  type="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 mb-2">
              <label className="text-sm font-semibold text-gray-700 ml-1" htmlFor="password">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              formAction={login}
              className="w-full bg-brand hover:bg-emerald-700 text-white rounded-xl py-3.5 font-bold text-base transition-all shadow-lg shadow-brand/25 flex items-center justify-center group"
            >
              Masuk Sekarang
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Atau</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              formAction={signup}
              className="w-full bg-white border-2 border-gray-100 hover:border-brand hover:bg-emerald-50 hover:text-brand text-gray-600 rounded-xl py-3.5 font-bold text-base transition-all"
            >
              Daftar Akun Baru
            </button>

            {resolvedSearchParams?.message && (
              <div className="mt-2 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center rounded-xl animate-in fade-in slide-in-from-top-2">
                {resolvedSearchParams.message}
              </div>
            )}
          </form>
        </div>
        
        <div className="mt-8 text-emerald-100/60 text-sm text-center">
          &copy; {new Date().getFullYear()} NyuVenture. MVP Project.
        </div>
      </div>
    </div>
  )
}
