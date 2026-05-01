import Link from 'next/link';
import { Search, Map as MapIcon, Coffee, Bed, Bus, Heart, Compass, Star, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function MVPPage() {
  const categories = [
    { name: 'Destinasi', icon: <Compass className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
    { name: 'Dekat Anda', icon: <MapIcon className="w-6 h-6" />, color: 'bg-brand/20 text-brand', href: '/mvp/dekat-anda' },
    { name: 'Kuliner', icon: <Coffee className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600' },
    { name: 'Penginapan', icon: <Bed className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
    { name: 'Transportasi', icon: <Bus className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Wishlist', icon: <Heart className="w-6 h-6" />, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="flex flex-col flex-1 h-full bg-white md:bg-gray-50">
      <div className="bg-brand text-white p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Mau explore apa hari ini?</h1>
          <p className="text-brand-light mb-6">Temukan petualangan terbaikmu di Banyumas</p>
          
          <div className="bg-white rounded-full flex items-center px-4 py-3 shadow-lg">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Cari Baturraden, curug, sate bebek..." 
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4 hidden md:block">Kategori Layanan</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-y-6 gap-x-2 md:gap-4">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              href={cat.href || '#'} 
              className={`flex flex-col items-center ${i >= 4 ? 'col-span-2 md:col-span-1' : 'col-span-1'}`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-2 shadow-sm transition-transform hover:scale-105 hover:shadow-md ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-8 mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-brand rounded-2xl p-6 text-white relative overflow-hidden shadow-lg flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
          <div className="z-10 relative">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3 inline-block backdrop-blur-md">PROMO TERBATAS</span>
            <h3 className="text-xl font-bold mb-1">Diskon 50% Tiket Baturraden!</h3>
            <p className="text-sm text-white/80">Berlaku untuk 100 pembeli pertama hari ini</p>
          </div>
          <ChevronRight className="w-8 h-8 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all z-10" />
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-tl-full"></div>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-8 flex-1">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Rekomendasi Populer</h2>
          <Link href="#" className="text-sm font-medium text-brand hover:underline">Lihat Semua</Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {[
            { name: "Lokawisata Baturraden", type: "Destinasi", rating: 4.8, price: "Rp 15.000", img: "https://img.freepik.com/free-photo/beautiful-view-waterfall-jungle_23-2148154145.jpg?t=st=1714460000~exp=1714463600~hmac=a1b2c" },
            { name: "Curug Bayan", type: "Destinasi", rating: 4.6, price: "Rp 10.000", img: "https://img.freepik.com/free-photo/scenic-view-waterfall-forest_23-2148145914.jpg" },
            { name: "Sate Bebek Tambak", type: "Kuliner", rating: 4.9, price: "Rp 35.000", img: "https://img.freepik.com/free-photo/flat-lay-composition-delicious-indonesian-food_23-2148734685.jpg" }
          ].map((item, i) => (
            <div key={i} className="min-w-[240px] md:min-w-[280px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden snap-start hover:shadow-md transition-shadow group">
              <div className="h-32 md:h-40 bg-gray-200 relative overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700">
                  {item.type}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 truncate pr-2">{item.name}</h3>
                  <div className="flex items-center text-amber-500 text-sm">
                    <Star className="w-3.5 h-3.5 fill-current mr-1" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <p className="text-brand font-bold mt-2">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
