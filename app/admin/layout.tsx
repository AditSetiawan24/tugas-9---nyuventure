import { LayoutDashboard, Users, Ticket, LogOut, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <Link href="/admin/dashboard" className="text-lg font-bold text-brand flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5" />
          NyuAdmin
        </Link>
        <form action="/auth/signout" method="post">
          <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition flex items-center gap-2 text-sm font-medium">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </form>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-shrink-0 flex-col sticky top-0 h-screen z-10">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <Link href="/admin/dashboard" className="text-xl font-bold text-brand flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            NyuAdmin
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand transition">
            <Ticket className="w-5 h-5" />
            Kelola Tiket
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand transition">
            <Users className="w-5 h-5" />
            Pengguna
          </Link>
          <Link href="/admin/contacts" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand transition">
            <Mail className="w-5 h-5" />
            Pesan Kontak
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition font-medium">
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-20 pb-safe">
        <Link href="/admin/dashboard" className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-brand">
          <Ticket className="w-5 h-5" />
          <span className="text-[10px] font-medium">Tiket</span>
        </Link>
        <Link href="/admin/users" className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-brand">
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Pengguna</span>
        </Link>
        <Link href="/admin/contacts" className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-brand">
          <Mail className="w-5 h-5" />
          <span className="text-[10px] font-medium">Pesan</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
