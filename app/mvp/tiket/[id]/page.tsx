'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Ticket as TicketIcon, Calendar, Clock, MapPin, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function ETicketPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  
  const placeName = searchParams.get('name') || 'Destinasi Wisata';
  const qty = searchParams.get('qty') || '1';
  const total = searchParams.get('total') || '17000';
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  const [address, setAddress] = useState('Memuat lokasi...');

  useEffect(() => {
    if (lat && lon) {
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(res => res.json())
        .then(data => {
          if (data && data.address) {

             const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Lokasi Wisata';
             const state = data.address.state || '';
             setAddress(`${city}${state ? `, ${state}` : ''}`);
          } else {
             setAddress('Lokasi Tidak Diketahui');
          }
        })
        .catch(() => setAddress('Area Wisata Lokal'));
    } else {
      setAddress('Lokasi Wisata Terpilih');
    }
  }, [lat, lon]);


  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-[calc(100vh-64px)] md:min-h-0 bg-brand flex flex-col relative pb-20 md:pb-0 overflow-hidden">
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      
      <div className="px-4 py-4 flex items-center gap-3 text-white relative z-10">
        <button onClick={() => router.back()} className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg">E-Tiket Anda</h1>
      </div>

      <div className="flex-1 p-4 md:p-8 flex flex-col items-center relative z-10">
        
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          
          <div className="p-6 pb-8 bg-gradient-to-b from-white to-gray-50 border-b-2 border-dashed border-gray-200 relative">
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-brand rounded-full"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-brand rounded-full"></div>

            <div className="flex justify-between items-start mb-6">
              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircleIcon className="w-3.5 h-3.5" /> Lunas
              </div>
              <span className="text-gray-400 text-sm font-mono">#{resolvedParams.id.substring(0, 8).toUpperCase()}</span>
            </div>

            <h2 className="text-2xl font-black text-gray-800 leading-tight mb-2 pr-4">{placeName}</h2>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 mr-3 text-brand shrink-0" />
                <span className="font-medium">{today}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="w-4 h-4 mr-3 text-brand shrink-0" />
                <span className="font-medium">Berlaku seharian</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-3 text-brand shrink-0" />
                <span className="font-medium truncate">{address}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <TicketIcon className="w-4 h-4 mr-3 text-brand shrink-0" />
                <span className="font-medium">{qty} Orang (Tiket Masuk)</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white flex flex-col items-center pt-8">
            <p className="text-sm text-gray-500 mb-4 text-center">Tunjukkan QR code ini di pintu masuk wisata</p>
            
            <div className="w-48 h-48 bg-gray-50 border-2 border-gray-100 rounded-2xl flex items-center justify-center p-4">
              <QrCode className="w-full h-full text-gray-800" strokeWidth={1} />
            </div>

            <p className="font-mono text-gray-400 mt-4 tracking-[0.2em] text-sm">
              {resolvedParams.id.substring(0, 12).toUpperCase()}
            </p>
          </div>

        </div>

        <div className="w-full max-w-sm mt-8">
          <Link 
            href={`/mvp/rute/${resolvedParams.id}?lat=${lat}&lon=${lon}&name=${encodeURIComponent(placeName)}`}
            className="w-full flex items-center justify-center gap-2 bg-white text-brand font-bold py-4 rounded-xl hover:bg-gray-50 transition shadow-lg"
          >
            <MapPin className="w-5 h-5" />
            Mulai Perjalanan ke Lokasi
          </Link>
        </div>

      </div>
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
