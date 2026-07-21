'use client';

import { ChevronDown } from 'lucide-react';

export default function HeroButton() {
  return (
    <button
      onClick={() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })}
      className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white/60 hover:text-white hover:border-white/80 transition-all duration-300 animate-bounce-subtle cursor-pointer"
      aria-label="Scroll to content"
    >
      <ChevronDown size={20} className="sm:w-6 sm:h-6" />
    </button>
  );
}
