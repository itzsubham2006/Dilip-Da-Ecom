import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { Metadata } from 'next';

const MenuItems = dynamic(() => import('../(menu)/MenuItems').then((m) => ({ default: m.MenuItems })));

export const metadata: Metadata = { title: 'Menu' };

const sections = [
  {
    category: 'Biryani & Rice',
    items: [
      { id: 'biryani-1', name: 'Kolkata Biryani', price: 280, desc: 'Fragrant basmati rice with tender chicken, potato & egg', veg: false, popular: true, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop' },
      { id: 'biryani-2', name: 'Mutton Biryani', price: 350, desc: 'Slow-cooked mutton biryani with aromatic spices', veg: false, popular: true, img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop' },
      { id: 'biryani-3', name: 'Vegetable Biryani', price: 220, desc: 'Mixed vegetable biryani with saffron & ghee', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop' },
      { id: 'rice-1', name: 'Daal & Rice', price: 160, desc: 'Comforting dal chawal with ghee & papad', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop' },
    ],
  },
  {
    category: 'Fish & Seafood',
    items: [
      { id: 'fish-1', name: 'Macher Jhol', price: 220, desc: 'Traditional fish curry with turmeric & ginger', veg: false, popular: true, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop' },
      { id: 'fish-2', name: 'Shorshe Ilish', price: 350, desc: 'Hilsa fish in mustard gravy — a local classic', veg: false, popular: true, img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop' },
      { id: 'fish-3', name: 'Fish Fry', price: 180, desc: 'Crispy fried fish fillet with salad & sauce', veg: false, popular: false, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop' },
      { id: 'fish-4', name: 'Prawn Malai Curry', price: 320, desc: 'Rich coconut milk based prawn curry', veg: false, popular: false, img: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=400&fit=crop' },
    ],
  },
  {
    category: 'Meat & Poultry',
    items: [
      { id: 'meat-1', name: 'Mutton Kosha', price: 320, desc: 'Slow-cooked mutton in thick spicy gravy', veg: false, popular: true, img: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop' },
      { id: 'meat-2', name: 'Chicken Rezala', price: 250, desc: 'Creamy white chicken gravy with cashew paste', veg: false, popular: false, img: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop' },
      { id: 'meat-3', name: 'Chicken Curry', price: 220, desc: 'Homestyle chicken curry with potatoes', veg: false, popular: false, img: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop' },
      { id: 'meat-4', name: 'Keema Paratha', price: 180, desc: 'Stuffed minced meat paratha served with yogurt', veg: false, popular: false, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop' },
    ],
  },
  {
    category: 'Vegetarian',
    items: [
      { id: 'veg-1', name: 'Shukto', price: 140, desc: 'Traditional mixed vegetable bitter preparation', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop' },
      { id: 'veg-2', name: 'Aloo Posto', price: 130, desc: 'Potatoes cooked in poppy seed paste', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop' },
      { id: 'veg-3', name: 'Chholar Dal', price: 120, desc: 'Homestyle chana dal with coconut & ghee', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop' },
      { id: 'veg-4', name: 'Paneer Butter Masala', price: 240, desc: 'Rich creamy paneer curry with butter', veg: true, popular: true, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop' },
    ],
  },
  {
    category: 'Sweets',
    items: [
      { id: 'sweet-1', name: 'Misti Doi', price: 80, desc: 'Traditional sweet yogurt', veg: true, popular: true, img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop' },
      { id: 'sweet-2', name: 'Rosogolla', price: 70, desc: 'Soft spongy cottage cheese balls in sugar syrup', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop' },
      { id: 'sweet-3', name: 'Sandesh', price: 90, desc: 'Traditional sweet made from fresh paneer', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop' },
    ],
  },
];

export default function MenuPage() {
  return (
    <div className="page-pad">
      <div className="container-z mx-auto max-w-5xl">
        {/* Added a beautiful header image for the menu page */}
        <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-6 mt-2 shadow-z border border-zborder">
          <Image
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=600&fit=crop"
            alt="Delicious fresh food spread"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Our Menu</h1>
            <p className="text-sm text-white/80 mt-1 max-w-md">Explore our complete range of culinary delights prepared fresh daily.</p>
          </div>
        </div>
        
        <MenuItems sections={sections} />
      </div>
    </div>
  );
}
