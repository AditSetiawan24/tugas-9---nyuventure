'use client';

import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';  
import Link from 'next/link';
import { use } from 'react';

const MapRoute = dynamic(() => import('../../../components/MapRoute'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
    </div>
  ),
});

export default function RutePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ name?: string, lat?: string, lon?: string }>
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  
  const destLat = resolvedSearchParams.lat ? parseFloat(resolvedSearchParams.lat) : undefined;
  const destLon = resolvedSearchParams.lon ? parseFloat(resolvedSearchParams.lon) : undefined;
  const placeName = resolvedSearchParams.name || 'Destinasi Tujuan';

  return (
    <div className="relative w-full flex-1 flex flex-col bg-white">
      <div className="z-[400] bg-white px-4 py-3 shadow-sm flex items-center gap-3">
        <Link href="/mvp/dekat-anda" className="p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-bold text-gray-800">Menuju {placeName}</h1>
          <p className="text-xs text-gray-500">Navigasi Rute Perjalanan</p>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <div className="absolute inset-0">
          <MapRoute destLat={destLat} destLon={destLon} placeName={placeName} />
        </div>
      </div>
    </div>
  );
}
