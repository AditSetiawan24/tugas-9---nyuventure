import { createClient } from '@/utils/supabase/server';
import { Mail, MessageSquare } from 'lucide-react';

export default async function AdminContactsPage() {
  const supabase = await createClient();
  
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pesan Kontak</h1>
        <p className="text-gray-500 text-sm mt-1">Daftar pesan dan masukan dari pengunjung</p>
      </div>

      <div className="grid gap-6">
        {contacts && contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start transition hover:shadow-md">
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {new Date(contact.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-brand font-medium">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                </div>

                <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 relative">
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-white px-2 border border-gray-100 rounded-full text-xs font-semibold text-gray-500 flex items-center gap-1 shadow-sm">
                    <MessageSquare className="w-3 h-3" /> Topik: {contact.topic}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed mt-2">
                    {contact.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">Tidak ada pesan kontak yang masuk.</p>
          </div>
        )}
      </div>
    </div>
  );
}
