import Link from 'next/link';
import { Compass } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function MVPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 md:pb-0">

      <main className="flex-1 w-full flex flex-col h-full relative">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
