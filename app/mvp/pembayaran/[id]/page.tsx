'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, ArrowLeft, Minus, Plus, Ticket as TicketIcon, MapIcon } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { saveTicketAction } from '@/app/actions/ticket';

export default function PembayaranPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [status, setStatus] = useState<'pending' | 'processing' | 'success'>('pending');
  const [placeId, setPlaceId] = useState<string>('');
  const [ticketId, setTicketId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  const placeName = searchParams.get('name') || 'Destinasi Wisata';
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  const ticketPrice = 15000;
  const serviceFee = 2000;
  const totalPayment = (ticketPrice * quantity) + serviceFee;

  useEffect(() => {
    params.then((p) => setPlaceId(p.id));
  }, [params]);

  const handlePayment = async () => {
    setStatus('processing');
    
    try {

      const result = await saveTicketAction({
        placeId,
        placeName,
        amount: totalPayment,
        quantity: quantity,
      });

      if (!result.success) {
        if (result.error?.includes('login')) {
          alert(result.error);
        } else {
          throw new Error(result.error);
        }
        setStatus('pending');
        return;
      }

      if (result.ticketId) {
        setTicketId(result.ticketId);
      }
      
      setStatus('success');
      
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan tiket! Pastikan pengaturan database Anda sudah benar.');
      setStatus('pending');
    }
  };

  const handleRute = () => {
    let routeUrl = `/mvp/rute/${placeId}?name=${encodeURIComponent(placeName)}`;
    if (lat && lon) {
      routeUrl += `&lat=${lat}&lon=${lon}`;
    }
    router.push(routeUrl);
  };

  const handleETicket = () => {

    const id = ticketId || placeId;
    let ticketUrl = `/mvp/tiket/${id}?name=${encodeURIComponent(placeName)}&qty=${quantity}&total=${totalPayment}`;
    if (lat && lon) {
      ticketUrl += `&lat=${lat}&lon=${lon}`;
    }
    router.push(ticketUrl);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] md:min-h-0 bg-gray-50 flex flex-col md:rounded-2xl md:overflow-hidden md:shadow-xl relative pb-20 md:pb-0">
      <div className="bg-white px-4 py-4 shadow-sm flex items-center gap-3">
        <Link href="/mvp/dekat-anda" className="p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-gray-800 text-lg">Pembayaran Tiket</h1>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="text-sm text-gray-500 mb-1">Detail Pemesanan</h2>
          <p className="font-bold text-gray-800 text-lg mb-4">{placeName}</p>
          
          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <span className="text-gray-600">Jumlah Tiket</span>
            <div className="flex items-center gap-4 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={status !== 'pending' || quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm border border-gray-200 text-gray-600 disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-gray-800 w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                disabled={status !== 'pending'}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm border border-gray-200 text-gray-600 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <span className="text-gray-600">Tiket Masuk ({quantity}x)</span>
            <span className="font-semibold">Rp {(ticketPrice * quantity).toLocaleString('id-ID')}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Biaya Layanan</span>
            <span className="font-semibold">Rp {serviceFee.toLocaleString('id-ID')}</span>
          </div>

          <div className="flex justify-between items-center py-4">
            <span className="font-bold text-gray-800">Total Pembayaran</span>
            <span className="font-bold text-brand text-xl">Rp {totalPayment.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 text-center mt-auto md:mt-0">
          {status === 'pending' && (
            <>
              <p className="text-gray-600 mb-6">Metode Pembayaran: <strong>QRIS (Mock)</strong></p>
              <button 
                onClick={handlePayment}
                className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition"
              >
                Bayar Sekarang
              </button>
            </>
          )}

          {status === 'processing' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
              <p className="font-semibold text-gray-700">Memproses pembayaran...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="font-bold text-xl text-gray-800 mb-6">Pembayaran Berhasil!</h3>
              
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={handleETicket}
                  className="w-full flex items-center justify-center gap-2 bg-brand text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition shadow-md shadow-brand/20"
                >
                  <TicketIcon className="w-5 h-5" />
                  Lihat E-Tiket (Bukti Masuk)
                </button>
                <button 
                  onClick={handleRute}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
                >
                  <MapIcon className="w-5 h-5" />
                  Mulai Navigasi Rute
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
