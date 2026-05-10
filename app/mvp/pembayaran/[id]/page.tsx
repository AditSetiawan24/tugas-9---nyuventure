'use client';

import { useEffect, useState, useActionState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, ArrowLeft, Minus, Plus, Ticket as TicketIcon, MapIcon } from 'lucide-react';
import Link from 'next/link';
import { saveTicketAction } from '@/app/actions/ticket';

export default function PembayaranPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [placeId, setPlaceId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  const [state, formAction, isPending] = useActionState(saveTicketAction, null);
  
  const placeName = searchParams.get('name') || 'Destinasi Wisata';
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  const ticketPrice = 15000;
  const serviceFee = 2000;
  const totalPayment = (ticketPrice * quantity) + serviceFee;

  useEffect(() => {
    params.then((p) => setPlaceId(p.id));
  }, [params]);

  const handleRute = () => {
    let routeUrl = `/mvp/rute/${placeId}?name=${encodeURIComponent(placeName)}`;
    if (lat && lon) {
      routeUrl += `&lat=${lat}&lon=${lon}`;
    }
    router.push(routeUrl);
  };

  const handleETicket = () => {
    const id = state?.ticketId || placeId;
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
        {!state?.success ? (
          <form action={formAction} className="flex-1 flex flex-col">
            <input type="hidden" name="placeId" value={placeId} />
            <input type="hidden" name="placeName" value={placeName} />
            <input type="hidden" name="amount" value={totalPayment} />
            <input type="hidden" name="quantity" value={quantity} />

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <h2 className="text-sm text-gray-500 mb-4">Informasi Pemesan</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                  <input type="text" name="customerName" defaultValue={state?.data?.customerName || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition" placeholder="Nama Lengkap" />
                  {state?.errors?.customerName && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.customerName[0]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" name="customerEmail" defaultValue={state?.data?.customerEmail || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition" placeholder="email@example.com" />
                  {state?.errors?.customerEmail && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.customerEmail[0]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor WhatsApp / Telepon</label>
                  <input type="tel" name="customerPhone" defaultValue={state?.data?.customerPhone || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition" placeholder="08123456789" />
                  {state?.errors?.customerPhone && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.customerPhone[0]}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <h2 className="text-sm text-gray-500 mb-1">Detail Pemesanan</h2>
              <p className="font-bold text-gray-800 text-lg mb-4">{placeName}</p>
              
              <div className="flex justify-between items-center py-3 border-t border-gray-100">
                <span className="text-gray-600">Jumlah Tiket</span>
                <div className="flex items-center gap-4 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isPending || quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm border border-gray-200 text-gray-600 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-gray-800 w-4 text-center">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isPending}
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
              {state?.success === false && !state?.errors && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-semibold text-center mb-4">
                  {state.message}
                </div>
              )}
              
              <p className="text-gray-600 mb-6">Metode Pembayaran: <strong>QRIS (Mock)</strong></p>
              <button 
                type="submit"
                disabled={isPending}
                className={`w-full font-bold py-4 rounded-xl transition flex justify-center items-center gap-2 ${
                  isPending ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-brand text-white hover:bg-emerald-700'
                }`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                  </>
                ) : (
                  'Bayar Sekarang'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center mt-auto md:mt-0 flex-1 flex flex-col justify-center">
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
          </div>
        )}
      </div>
    </div>
  );
}
