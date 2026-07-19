import Link from 'next/link';
import { Star, Clock, ArrowLeft, Bike } from 'lucide-react';
import type { Metadata } from 'next';
import { MenuItems } from './MenuItems';

const menus = [
  {
    category: 'Recommended',
    items: [
      { name: 'Butter Chicken', price: 320, desc: 'Creamy tomato-based curry with tender chicken pieces', veg: true, popular: true, img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae7b0?w=200&h=200&fit=crop' },
      { name: 'Dal Makhani', price: 220, desc: 'Slow-cooked black lentils in rich creamy gravy', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop' },
      { name: 'Garlic Naan', price: 60, desc: 'Tandoor-baked leavened bread with garlic butter', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop' },
    ],
  },
  {
    category: 'Starters',
    items: [
      { name: 'Chicken Tikka', price: 280, desc: 'Marinated chicken pieces grilled in tandoor', veg: false, popular: true, img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&h=200&fit=crop' },
      { name: 'Paneer Tikka', price: 250, desc: 'Cottage cheese marinated in spices & grilled', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=200&fit=crop' },
    ],
  },
  {
    category: 'Main Course',
    items: [
      { name: 'Chicken Biryani', price: 350, desc: 'Layered basmati rice with spiced chicken & saffron', veg: false, popular: true, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&h=200&fit=crop' },
      { name: 'Palak Paneer', price: 260, desc: 'Cottage cheese cubes in creamy spinach gravy', veg: true, popular: false, img: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=200&h=200&fit=crop' },
      { name: 'Nihari', price: 380, desc: 'Slow-cooked spicy stew with tender meat', veg: false, popular: true, img: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=200&h=200&fit=crop' },
    ],
  },
];

const restaurant = {
  name: 'Punjab Dhaba',
  slug: 'punjab-dhaba',
  cuisine: 'North Indian, Mughlai, Punjabi',
  rating: 4.5,
  totalRatings: 1250,
  eta: '25–35 min',
  cost: '₹300 for two',
  address: 'Near City Centre, Salt Lake, Kolkata',
  img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&h=400&fit=crop',
  isOpen: true,
  deliveryFee: '₹20',
  minOrder: '₹100',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') };
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img src={restaurant.img} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Link href="/restaurants" className="absolute top-4 left-4 flex items-center gap-1 text-white text-sm font-medium bg-black/30 rounded-lg px-3 py-1.5 hover:bg-black/50 transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="container-z mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-z p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ztext">{restaurant.name}</h1>
              <p className="text-ztext-light text-sm mt-1">{restaurant.cuisine}</p>
              <div className="flex items-center gap-3 text-xs text-ztext-lighter mt-2">
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-ztext-light">
                <span className="flex items-center gap-1"><Clock size={14} /> {restaurant.eta}</span>
                <span className="flex items-center gap-1"><Bike size={14} /> {restaurant.deliveryFee}</span>
                <span>Min. {restaurant.minOrder}</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="rating-badge high text-sm px-3 py-1">
                <Star size={12} fill="currentColor" /> {restaurant.rating}
              </span>
              <span className="text-xs text-ztext-lighter">{restaurant.totalRatings}+ ratings</span>
              <span className="text-xs text-ztext-light font-medium mt-1">{restaurant.cost}</span>
            </div>
          </div>
          {restaurant.isOpen && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-zgreen" />
              <span className="text-zgreen font-medium">Open now</span>
              <span className="text-ztext-lighter">|</span>
              <span className="text-ztext-lighter">Today 9:00 AM – 10:00 PM</span>
            </div>
          )}
        </div>
      </div>

      <div className="container-z mx-auto px-4 mt-8 pb-12">
        <MenuItems sections={menus} restaurantSlug={restaurant.slug} restaurantName={restaurant.name} />
      </div>
    </div>
  );
}
