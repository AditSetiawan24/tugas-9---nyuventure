'use client';

import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const MapNearYou = dynamic(() => import('../../components/MapNearYou'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
    </div>
  ),
});

export default function DekatAndaPage() {
  return (
    <div className="relative w-full flex-1 flex flex-col bg-white">
      <div className="absolute top-0 inset-x-0 z-[400] bg-white/80 backdrop-blur-md px-4 py-3 shadow-sm flex items-center gap-3">
        <Link href="/mvp" className="p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-bold text-gray-800">Dekat Anda</h1>
          <p className="text-xs text-gray-500">Menemukan wisata terdekat...</p>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <div className="absolute inset-0">
          <MapNearYou />
        </div>
      </div>
    </div>
  );
}
