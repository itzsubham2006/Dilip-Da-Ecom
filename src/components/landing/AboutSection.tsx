'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Clock, Star } from 'lucide-react';

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

const stats = [
  { label: 'Years of Service', value: '15+' },
  { label: 'Daily Customers', value: '500+' },
  { label: 'Menu Items', value: '50+' },
  { label: 'Rating', value: '4.7★' },
];

export default function AboutSection() {
  const { ref, isVisible } = useScrollReveal(0.05);

  return (
    <section id="about" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight">
              About{' '}
              <span style={{ color: '#E23744' }}>Dilip Stores</span>
            </h2>
            <p className="text-[#696969] text-base sm:text-lg mt-4 sm:mt-6 leading-relaxed">
              For over a decade, Dilip Stores has been the heart of Kokrajhar&apos;s culinary scene.
              We bring you the finest Bengali cuisine, crafted with love using time-honored recipes
              and the freshest ingredients. Every dish tells a story of tradition, flavor, and
              hospitality.
            </p>

            <div className="mt-8 sm:mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-zred mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A1A1A] text-sm">Location</p>
                  <p className="text-[#696969] text-sm">
                    Near Kokrajhar Bus Stand, BTAD, Assam
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-zred mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A1A1A] text-sm">Hours</p>
                  <p className="text-[#696969] text-sm">10:00 AM – 10:00 PM (Mon–Sun)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-zred mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A1A1A] text-sm">Contact</p>
                  <p className="text-[#696969] text-sm">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#FAFAFA] rounded-2xl p-6 sm:p-8 text-center hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow"
              >
                <p className="text-3xl sm:text-4xl font-black text-zred">{stat.value}</p>
                <p className="text-[#696969] text-sm sm:text-base mt-1.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
