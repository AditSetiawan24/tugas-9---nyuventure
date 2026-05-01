import Link from 'next/link';
import { Compass, Map, MapPin, Building, BusFront, Store, Ticket, Star, Mail, Phone, Send } from 'lucide-react';
import ContactForm from './components/ContactForm';
export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full relative bg-[#f3f5f4] text-[#1f2b29]">
      <section className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(rgba(12, 26, 31, 0.55), rgba(12, 26, 31, 0.55)), url('/gambar1.png')`
          }}
        />
        <div className="z-10 container mx-auto px-4 py-14 max-w-7xl flex flex-col items-start w-full">
          <div className="max-w-[640px] flex flex-col gap-2">
            <h1 className="text-4xl md:text-[3rem] font-bold text-white mb-3 leading-[1.15]">
              Jelajahi Banyumas tanpa ribet
            </h1>
            <p className="text-lg text-[#edf8f4] mb-6">
              Temukan destinasi, kuliner, penginapan, dan transportasi dalam satu halaman yang ringkas dan mudah dipakai.
            </p>
            <div className="flex flex-wrap gap-3 mb-3">
              <Link href="/mvp" className="bg-brand text-white border border-brand px-6 py-3 rounded-md text-lg font-medium hover:bg-[#176252] hover:border-[#176252] transition">
                Mulai
              </Link>
              <Link href="/contact" className="border border-white text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-white hover:text-black transition">
                Hubungi Kami
              </Link>
            </div>
            <p className="text-[#e1f2ec] m-0 flex items-center gap-2">
              <CheckCircleFilled className="text-[#9df1d1]" /> 120+ destinasi pilihan, update informasi setiap hari.
            </p>
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#f3f5f4]" id="features">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-[680px] mx-auto text-center mb-10">
            <h2 className="text-[2rem] font-bold mb-2">Fitur Utama</h2>
            <p className="text-[#5d6a67]">
              Dirancang dengan alur sederhana agar wisatawan lokal maupun luar kota bisa merencanakan perjalanan lebih cepat.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Map, title: 'Destinasi Terkurasi', desc: 'Jelajahi tempat wisata favorit dengan detail tiket, jam operasional, serta rekomendasi aktivitas di sekitarnya.' },
              { icon: MapPin, title: 'Dekat Anda', desc: 'Sistem lokasi otomatis menampilkan wisata, kuliner, dan penginapan paling relevan dari posisi Anda saat ini.' },
              { icon: Building, title: 'Penginapan Nyaman', desc: 'Bandingkan banyak pilihan penginapan dengan harga transparan, fasilitas lengkap, dan rating pengguna.' },
              { icon: BusFront, title: 'Transportasi Praktis', desc: 'Temukan opsi perjalanan dengan estimasi waktu tempuh, rute tercepat, dan alternatif kendaraan.' },
              { icon: Store, title: 'Kuliner Lokal', desc: 'Cari tempat makan khas Banyumas berdasarkan kategori menu, rating, dan ulasan pengunjung terbaru.' },
              { icon: Ticket, title: 'Tiket Online', desc: 'Pesan tiket destinasi langsung dari platform untuk meminimalkan antrean dan menghemat waktu perjalanan.' }
            ].map((feat, i) => (
              <article key={i} className="bg-white border border-[#d8dede] rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 rounded-lg bg-[#e8f0ed] text-brand flex items-center justify-center shrink-0">
                    <feat.icon className="w-5 h-5"/>
                  </span>
                  <h3 className="text-lg font-bold mb-0">{feat.title}</h3>
                </div>
                <p className="text-[#5d6a67] m-0 leading-relaxed">{feat.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#f7faf8]" id="testimonials">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-[680px] mx-auto text-center mb-10">
            <h2 className="text-[2rem] font-bold mb-2">Dipakai wisatawan dan pelaku wisata lokal</h2>
            <p className="text-[#5d6a67]">
              Ulasan nyata dari pengguna yang telah merencanakan perjalanan mereka bersama NyuVenture.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Rizky Wangsaff', comment: '"Sangat membantu saat mencari destinasi keluarga di akhir pekan. Informasinya detail dan tampilannya enak dibaca. Memberi laiks."' },
              { name: 'Mas Amba Asli Ngawi', comment: '"Rekomendasi kuliner dan penginapannya pas dengan budget. Proses cari tempat jadi jauh lebih cepat banget loh ya."' },
              { name: 'Agus Icikiwir', comment: '"Navigasinya simpel, cocok untuk pengguna baru. Fitur dekat Anda memudahkan saya menentukan rute harian coy."' }
            ].map((t, idx) => (
              <article key={idx} className="bg-white border border-[#d9e1de] rounded-xl p-6 flex flex-col h-full">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  <Star fill="currentColor" className="w-4 h-4"/>
                  <Star fill="currentColor" className="w-4 h-4"/>
                  <Star fill="currentColor" className="w-4 h-4"/>
                  <Star fill="currentColor" className="w-4 h-4"/>
                  <Star fill="currentColor" className="w-4 h-4"/>
                </div>
                <p className="text-[#425450] italic mb-4 flex-1">{t.comment}</p>
                <h3 className="text-base font-bold mb-0">{t.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#f3f5f4]" id="contact">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-[680px] mx-auto text-center mb-10">
            <h2 className="text-[2rem] font-bold mb-2">Siap membantu perjalanan Anda di Banyumas</h2>
            <p className="text-[#5d6a67]">
              Kirim pesan untuk kolaborasi, masukan fitur, atau bantuan seputar rekomendasi destinasi.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="lg:w-2/5 md:p-12 p-8 bg-brand-dark text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-8">Informasi Kontak</h2>
                  <ul className="space-y-8">
                    <li className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-brand-light shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-lg">Email Utama</p>
                        <p className="text-gray-300">weare@nyuventure.id</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-brand-light shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-lg">Telepon/WhatsApp</p>
                        <p className="text-gray-300">+62 812 3456 7890</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-brand-light shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-lg">Basecamp</p>
                        <p className="text-gray-300">Jl. Ringin Tirto No. 42,<br/>Purwokerto, Banyumas 53123</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 pt-12 border-t border-white/20">
                  <p className="italic text-gray-300">&quot;Setiap perjalanan dimulai dari satu pesan sederhana.&quot;</p>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
function CheckCircleFilled(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    </svg>
  );
}
