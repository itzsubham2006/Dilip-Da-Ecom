'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useCartStore } from '@/features/cart/store';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

const dishes = [
  { id: 'featured-1', name: 'Kolkata Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop', price: 280, veg: false },
  { id: 'featured-2', name: 'Macher Jhol', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop', price: 220, veg: false },
  { id: 'featured-3', name: 'Shorshe Ilish', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop', price: 350, veg: false },
  { id: 'featured-4', name: 'Mutton Kosha', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop', price: 320, veg: false },
  { id: 'featured-5', name: 'Misti Doi', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop', price: 80, veg: true },
  { id: 'featured-6', name: 'Daal & Rice', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop', price: 160, veg: true },
];

export default function FeaturedDishes() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 320;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  }

  return (
    <section id="featured" className="py-12 sm:py-16 bg-zgray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ztext tracking-tight">
              Today's Menu
            </h2>
            <p className="text-ztext-light text-sm mt-1 max-w-xl">
              Handpicked favorites that define the soul of Bengali cuisine
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full bg-zcard border border-zborder flex items-center justify-center text-ztext hover:bg-zsurface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full bg-zcard border border-zborder flex items-center justify-center text-ztext hover:bg-zsurface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="flex-none w-[260px] sm:w-[280px] rounded-2xl overflow-hidden bg-zcard border border-zborder group transition-shadow hover:shadow-z-hover"
            >
              <div className="relative h-40 sm:h-44 overflow-hidden">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="280px"
                />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-ztext text-sm truncate">{dish.name}</h3>
                <p className="text-zred font-bold text-sm mt-1">₹{dish.price}</p>
                <button
                  onClick={() => addItem({ id: dish.id, name: dish.name, price: dish.price, veg: dish.veg, image: dish.image })}
                  className="mt-2 w-full text-xs font-bold text-white bg-zred rounded-lg py-2 hover:bg-zred-dark transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={12} /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
