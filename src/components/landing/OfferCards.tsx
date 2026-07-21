'use client';

import Image from 'next/image';
import { ShoppingBag, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/features/cart/store';
import { showToast } from '@/components/shared/Toast';

const offers = [
  { id: 'offer-1', name: 'Kolkata Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop', price: 280, subtext: 'Min. Order ₹499', veg: false },
  { id: 'offer-2', name: 'Macher Jhol', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop', price: 220, subtext: 'Min. Order ₹349', veg: false },
  { id: 'offer-3', name: 'Shorshe Ilish', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop', price: 350, subtext: 'Free delivery', veg: false },
  { id: 'offer-4', name: 'Mutton Kosha', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop', price: 320, subtext: 'Min. Order ₹599', veg: false },
  { id: 'offer-5', name: 'Misti Doi', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop', price: 80, subtext: 'Combo offer ₹149', veg: true },
  { id: 'offer-6', name: 'Daal & Rice', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop', price: 160, subtext: 'Min. Order ₹249', veg: true },
];

export default function OfferCards() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart(dish: (typeof offers)[0]) {
    addItem({ id: dish.id, name: dish.name, price: dish.price, veg: dish.veg, image: dish.image });
    showToast(`${dish.name} added to cart`);
  }

  function handleOrderNow(dish: (typeof offers)[0]) {
    addItem({ id: dish.id, name: dish.name, price: dish.price, veg: dish.veg, image: dish.image });
    router.push('/cart');
  }

  return (
    <section className="py-12 sm:py-16 bg-zgray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-ztext tracking-tight">
            Save More As You Order
          </h2>
          <p className="text-ztext-light text-sm mt-1">
            Exclusive deals on your favourite Bengali meals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {offers.map((dish) => (
            <div
              key={dish.id}
              className="flex flex-col bg-zcard border border-zborder rounded-2xl overflow-hidden transition-shadow hover:shadow-z-hover mx-4 sm:mx-0"
            >
              <div className="relative aspect-square">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  unoptimized
                />
              </div>

              <div className="flex flex-col flex-1 p-4 sm:p-5 text-center">
                <h3 className="font-bold text-ztext text-sm line-clamp-2 leading-snug min-h-[2.5em]">
                  {dish.name}
                </h3>

                <p className="text-ztext-light text-xs mt-1.5 line-clamp-1">
                  {dish.subtext}
                </p>

                <div className="mt-2">
                  <button className="text-xs font-semibold text-zred underline underline-offset-2 hover:text-zred-dark transition-colors">
                    View Details
                  </button>
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleAddToCart(dish)}
                    className="w-full text-xs font-bold text-ztext border border-zborder bg-zcard rounded-full py-2 hover:opacity-85 transition-opacity flex items-center justify-center gap-1.5"
                  >
                    <Plus size={12} /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleOrderNow(dish)}
                    className="w-full text-xs font-bold text-white bg-black rounded-full py-2.5 hover:opacity-85 transition-opacity flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={12} /> Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
