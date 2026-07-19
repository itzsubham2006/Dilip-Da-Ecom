'use client';

import { useCartStore } from '@/features/cart/store';
import type { CartItem } from '@/features/cart/types';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface MenuItem {
  name: string;
  price: number;
  desc: string;
  veg: boolean;
  popular: boolean;
  img: string;
}

interface MenuSection {
  category: string;
  items: MenuItem[];
}

export function MenuItems({ sections, restaurantSlug, restaurantName }: { sections: MenuSection[]; restaurantSlug: string; restaurantName: string }) {
  const store = useCartStore();
  const cartItems: CartItem[] = store.items;
  const { addItem, updateQuantity, removeItem, subtotal, deliveryFee, taxAmount, total, totalItems } = store;
  const [addedMsg, setAddedMsg] = useState('');

  function getQty(name: string) {
    return cartItems.find((i) => i.name === name)?.quantity ?? 0;
  }

  function handleAdd(item: MenuItem) {
    addItem({ id: item.name, name: item.name, price: item.price, veg: item.veg, image: item.img, restaurantSlug, restaurantName });
    setAddedMsg(item.name);
    setTimeout(() => setAddedMsg(''), 1200);
  }

  return (
    <div>
      <div className="flex gap-4 border-b border-zborder mb-6 overflow-x-auto">
        {sections.map((s) => (
          <a key={s.category} href={`#${s.category}`} className="shrink-0 pb-3 text-sm font-medium text-ztext-light hover:text-zred border-b-2 border-transparent hover:border-zred transition-colors">
            {s.category}
          </a>
        ))}
      </div>

      {sections.map((section) => (
        <div key={section.category} id={section.category} className="mb-10 scroll-mt-24">
          <h2 className="text-xl font-bold text-ztext mb-2">{section.category}</h2>
          <div className="divide-y divide-zborder">
            {section.items.map((item) => {
              const qty = getQty(item.name);
              return (
                <div key={item.name} className="py-5 flex gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${item.veg ? 'text-zgreen' : 'text-zred'}`}>{item.veg ? '🟢' : '🔴'}</span>
                      {item.popular && <span className="text-xs font-bold text-zred">Bestseller</span>}
                    </div>
                    <h3 className="font-semibold text-ztext mt-1">{item.name}</h3>
                    <p className="text-sm font-medium text-ztext mt-0.5">₹{item.price}</p>
                    <p className="text-xs text-ztext-light mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-zgray">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    {qty === 0 ? (
                      <button onClick={() => handleAdd(item)} className="text-xs font-bold text-zred border border-zred rounded-lg px-5 py-1.5 hover:bg-zred hover:text-white transition-colors">
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-zred text-white rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.name, qty - 1)} className="p-0.5"><Minus size={12} /></button>
                        <span className="text-xs font-bold w-4 text-center">{qty}</span>
                        <button onClick={() => updateQuantity(item.name, qty + 1)} className="p-0.5"><Plus size={12} /></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {addedMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-zgreen text-white text-sm font-medium px-4 py-2 rounded-lg shadow-z-modal animate-in">
          Added {addedMsg} to bag
        </div>
      )}

      {/* Floating cart bar */}
      {cartItems.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-zborder shadow-z-modal p-4">
          <div className="container-z mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-ztext-light">{totalItems()} item{totalItems() > 1 ? 's' : ''} • ₹{subtotal()}</p>
              <p className="text-lg font-bold text-ztext">₹{total()}</p>
            </div>
            <Link href="/cart" className="button-z button-z-primary gap-2 px-8">
              <ShoppingBag size={16} /> View bag
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
