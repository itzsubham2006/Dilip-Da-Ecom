import Image from 'next/image';
import HeroButton from './HeroButton';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 animate-fade-up">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tight leading-none">
          Dilip Da
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 mt-4 sm:mt-6 font-light tracking-wide animate-fade-up">
          Homestyle Bengali meals near CIT Kokrajhar
        </p>
      </div>

      <HeroButton />
    </section>
  );
}
