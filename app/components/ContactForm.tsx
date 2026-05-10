"use client";
import { Send, Loader2 } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';
import { saveContactAction } from '@/app/actions/contact';

export default function ContactForm({ 
  className = "lg:w-3/5 md:p-12 p-8 flex flex-col justify-center",
  title = "Kirimkan Surat Digital"
}: { className?: string, title?: string }) {
  const [state, formAction, isPending] = useActionState(saveContactAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className={className}>
      {title && <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>}
      <form ref={formRef} action={formAction} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <input type="text" name="name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition" placeholder="Kipli Sukata" />
            {state?.errors?.name && (
              <p className="text-red-500 text-sm mt-1">{state.errors.name[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input type="email" name="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition" placeholder="kipli@gmail.com" />
            {state?.errors?.email && (
              <p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Topik Pesan</label>
          <select name="topic" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition">
            <option value="Tanya Rute Wisata">Tanya Rute Wisata</option>
            <option value="Kerjasama Vendor">Kerjasama Vendor</option>
            <option value="Feedback Aplikasi">Feedback Aplikasi</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          {state?.errors?.topic && (
            <p className="text-red-500 text-sm mt-1">{state.errors.topic[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Isi Pesan</label>
          <textarea name="message" rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition resize-none" placeholder="Ceritakan detailnya di sini..."></textarea>
          {state?.errors?.message && (
            <p className="text-red-500 text-sm mt-1">{state.errors.message[0]}</p>
          )}
        </div>
        {state?.success && (
          <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg text-sm font-semibold text-center">
            {state.message}
          </div>
        )}
        {state?.success === false && !state?.errors && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-semibold text-center">
            {state.message}
          </div>
        )}
        <button 
          type="submit" 
          disabled={isPending}
          className={`font-bold px-8 py-4 rounded-xl w-full transition flex items-center justify-center gap-2 ${
            isPending ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-brand text-white hover:bg-emerald-700'
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Mengirim...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" /> Kirim Pesan Sekarang
            </>
          )}
        </button>
      </form>
    </div>
  );
}
