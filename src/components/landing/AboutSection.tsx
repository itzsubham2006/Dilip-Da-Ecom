'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

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
  { label: 'Years of Service', value: '5+' },
  { label: 'Daily Customers', value: '100+' },
  { label: 'Menu Items', value: '10+' },
  { label: 'Rating', value: '4.1★' },
];

export default function AboutSection() {
  const { ref, isVisible } = useScrollReveal(0.05);

  return (
    <section id="about" className="py-16 sm:py-24 bg-zbg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ztext tracking-tight">
              About{' '}
              <span className="text-zred">Dilip Da</span>
            </h2>
            <p className="text-ztext-light text-base sm:text-lg mt-4 sm:mt-6 leading-relaxed">
              Dilip Da is a homestyle Bengali food service run by Dilip da, located right near the
              2nd gate of Central Institute of Technology, Kokrajhar (CIT). With over 5 years of
              experience serving the CIT community, we cook fresh, authentic Bengali meals that
              taste just like home. Our menu is growing every week &mdash; from classic fish curry
              and steamed rice to quick snacks and evening chai &mdash; because we listen to what
              our students and customers want. Visit us near CIT Kokrajhar&apos;s 2nd gate or order
              online and taste the love in every bite.
            </p>

            <div className="mt-8 sm:mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-zred mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-ztext text-sm">Location</p>
                  <p className="text-ztext-light text-sm">
                    Near Central Institute of Technology, Kokrajhar (CIT), 2nd gate
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-zred mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-ztext text-sm">Hours</p>
                  <p className="text-ztext-light text-sm">10:00 AM – 10:00 PM (Mon–Sun)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-zred mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-ztext text-sm">Contact</p>
                    <p className="text-ztext-light text-sm">6000212823</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-zgray rounded-2xl p-6 sm:p-8 text-center hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow"
              >
                <p className="text-3xl sm:text-4xl font-bold text-zred">{stat.value}</p>
                <p className="text-ztext-light text-sm sm:text-base mt-1.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
