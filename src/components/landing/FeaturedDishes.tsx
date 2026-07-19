'use client';

import { useEffect, useRef, useState } from 'react';

const dishes = [
  {
    name: 'Kolkata Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
    price: '₹280',
  },
  {
    name: 'Macher Jhol',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae7b0?w=400&h=400&fit=crop',
    price: '₹220',
  },
  {
    name: 'Shorshe Ilish',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop',
    price: '₹350',
  },
  {
    name: 'Mutton Kosha',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop',
    price: '₹320',
  },
  {
    name: 'Misti Doi',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop',
    price: '₹80',
  },
  {
    name: 'Daal & Rice',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
    price: '₹160',
  },
];

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

function DishCard({ dish, index }: { dish: (typeof dishes)[0]; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-[#1A1A1A] text-sm sm:text-base">{dish.name}</h3>
        <p className="text-zred font-bold text-sm sm:text-base mt-1">{dish.price}</p>
      </div>
    </div>
  );
}

export default function FeaturedDishes() {
  const { ref, isVisible } = useScrollReveal(0.05);

  return (
    <section id="featured" className="py-16 sm:py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight">
            Our Signature Dishes
          </h2>
          <p className="text-[#696969] text-base sm:text-lg mt-3 sm:mt-4 max-w-xl mx-auto">
            Handpicked favorites that define the soul of Bengali cuisine
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {dishes.map((dish, i) => (
            <DishCard key={dish.name} dish={dish} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
