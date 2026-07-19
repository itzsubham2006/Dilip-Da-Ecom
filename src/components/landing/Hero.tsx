'use client';

import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToContent = () => {
    document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/2880507/2880507-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 animate-fade-up">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tight leading-none">
          Dilip Stores
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 mt-4 sm:mt-6 font-light tracking-wide animate-fade-up">
          #No. 1 Hotel in Kokrajhar
        </p>
      </div>

      <button
        onClick={scrollToContent}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white/60 hover:text-white hover:border-white/80 transition-all duration-300 animate-bounce-subtle cursor-pointer"
        aria-label="Scroll to content"
      >
        <ChevronDown size={20} className="sm:w-6 sm:h-6" />
      </button>
    </section>
  );
}
