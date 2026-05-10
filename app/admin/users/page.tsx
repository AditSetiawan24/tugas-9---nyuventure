import { createClient } from '@/utils/supabase/server';
import { User } from 'lucide-react';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengguna Terdaftar</h1>
        <p className="text-gray-500 text-sm mt-1">Daftar pengguna aplikasi NyuVenture</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">ID Pengguna</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Tanggal Bergabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                        <User className="w-4 h-4" />
                      </div>
                      {user.full_name || 'Tanpa Nama'}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
