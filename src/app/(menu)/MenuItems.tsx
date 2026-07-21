'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/features/cart/store';
import { ShoppingBag, Minus, Plus } from 'lucide-react';

interface MenuItem {
  id: string;
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

export function MenuItems({ sections }: { sections: MenuSection[] }) {
  const store = useCartStore();
  const { items: cartItems, addItem, updateQuantity, total, totalItems } = store;
  const cartCount = totalItems();

  function getQty(id: string) {
    return cartItems.find((i) => i.id === id)?.quantity ?? 0;
  }

  function handleAdd(item: MenuItem) {
    addItem({ id: item.id, name: item.name, price: item.price, veg: item.veg, image: item.img });
  }

  return (
    <div>
      <div className="flex gap-4 border-b border-zborder mb-6 overflow-x-auto sticky top-16 bg-zcard z-10 pb-3 pt-1">
        {sections.map((s) => (
          <a key={s.category} href={`#${s.category}`} className="shrink-0 text-sm font-medium text-ztext-light hover:text-zred border-b-2 border-transparent hover:border-zred transition-colors whitespace-nowrap">
            {s.category}
          </a>
        ))}
      </div>

      {sections.map((section) => (
        <div key={section.category} id={section.category} className="mb-8 scroll-mt-28">
          <h2 className="text-lg font-bold text-ztext mb-3">{section.category}</h2>
          <div className="divide-y divide-zborder">
            {section.items.map((item) => {
              const qty = getQty(item.id);
              return (
                <div key={item.id} className="py-4 flex gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${item.veg ? 'text-zgreen' : 'text-zred'}`}>{item.veg ? '🟢' : '🔴'}</span>
                      {item.popular && <span className="text-[10px] font-bold text-zred">Bestseller</span>}
                    </div>
                    <h3 className="font-medium text-ztext text-sm mt-0.5">{item.name}</h3>
                    <p className="text-sm font-semibold text-ztext mt-0.5">₹{item.price}</p>
                    <p className="text-xs text-ztext-light mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-zgray relative">
                      <Image src={item.img} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    {qty === 0 ? (
                      <button onClick={() => handleAdd(item)} className="text-[11px] font-bold text-zred border border-zred rounded-lg px-4 py-1 hover:bg-zred hover:text-white transition-colors">
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-zred text-white rounded-lg px-1.5 py-0.5">
                        <button onClick={() => updateQuantity(item.id, qty - 1)} aria-label={`Decrease quantity of ${item.name}`} className="p-0.5"><Minus size={11} /></button>
                        <span className="text-xs font-bold w-3 text-center">{qty}</span>
                        <button onClick={() => updateQuantity(item.id, qty + 1)} aria-label={`Increase quantity of ${item.name}`} className="p-0.5"><Plus size={11} /></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {cartCount > 0 && (
        <div className="sticky bottom-0 bg-zcard border-t border-zborder shadow-z-modal -mx-4 px-4 py-3 mt-6">
          <div className="container-z mx-auto flex items-center justify-between max-w-5xl">
            <div>
              <p className="text-xs text-ztext-light">{cartCount} item{cartCount > 1 ? 's' : ''}</p>
              <p className="text-lg font-bold text-ztext">₹{total()}</p>
            </div>
            <Link href="/cart" className="button-z button-z-primary gap-1.5 px-6 h-10 text-sm">
              <ShoppingBag size={15} /> View bag
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
