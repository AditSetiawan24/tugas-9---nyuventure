"use client";

import { useState } from "react";
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button 
        className="p-2 text-white/80 hover:text-white transition-colors relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 bg-brand-dark flex flex-col items-center justify-start pt-10 gap-8 text-xl z-40 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-200">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-white hover:text-brand-light transition">Home</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="text-white hover:text-brand-light transition">About</Link>
          <Link href="/services" onClick={() => setIsOpen(false)} className="text-white hover:text-brand-light transition">Services</Link>
          <Link href="/team" onClick={() => setIsOpen(false)} className="text-white hover:text-brand-light transition">Team</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="text-white hover:text-brand-light transition">Contact</Link>
          <Link href="/experiment" onClick={() => setIsOpen(false)} className="text-amber-400 hover:text-amber-300 font-bold transition">Experiment</Link>
          <Link href="/mvp" onClick={() => setIsOpen(false)} className="bg-brand text-white px-8 py-3 mt-4 rounded-full font-semibold hover:bg-emerald-700 transition shadow-lg">Mulai</Link>
        </div>
      )}
    </div>
  );
}
