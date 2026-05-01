"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map as MapIcon, Heart, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50 md:hidden pb-safe">
      <Link href="/mvp" className={`flex flex-col items-center p-2 transition-colors ${pathname === '/mvp' ? 'text-brand' : 'text-gray-500 hover:text-brand'}`}>
        <Home className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Home</span>
      </Link>
      <Link href="/mvp/dekat-anda" className={`flex flex-col items-center p-2 transition-colors ${pathname === '/mvp/dekat-anda' ? 'text-brand' : 'text-gray-500 hover:text-brand'}`}>
        <MapIcon className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Dekat Anda</span>
      </Link>
      <Link href="/mvp/wishlist" className={`flex flex-col items-center p-2 transition-colors ${pathname === '/mvp/wishlist' ? 'text-brand' : 'text-gray-500 hover:text-brand'}`}>
        <Heart className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Wishlist</span>
      </Link>
      <Link href="/mvp/profile" className={`flex flex-col items-center p-2 transition-colors ${pathname === '/mvp/profile' ? 'text-brand' : 'text-gray-500 hover:text-brand'}`}>
        <User className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-medium">Profile</span>
      </Link>
    </nav>
  );
}
