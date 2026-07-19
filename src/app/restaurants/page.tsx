import Link from 'next/link';
import { Star, Clock, Search, MapPin, SlidersHorizontal } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Restaurants near you' };

const restaurants = [
  { name: 'Punjab Dhaba', slug: 'punjab-dhaba', cuisine: 'North Indian, Mughlai', cost: '₹300 for two', rating: 4.5, eta: '25–35 min', off: '20% OFF', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
  { name: 'Dosa Express', slug: 'dosa-express', cuisine: 'South Indian, Kerala', cost: '₹200 for two', rating: 4.3, eta: '20–30 min', off: '15% OFF', img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop' },
  { name: 'Roll Hub', slug: 'roll-hub', cuisine: 'Fast Food, Rolls', cost: '₹250 for two', rating: 4.7, eta: '15–25 min', off: null, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  { name: 'Biryani House', slug: 'biryani-house', cuisine: 'Mughlai, Lucknowi', cost: '₹350 for two', rating: 4.4, eta: '30–40 min', off: '25% OFF', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop' },
  { name: 'Green Bowl', slug: 'green-bowl', cuisine: 'Healthy, Salads, Juices', cost: '₹200 for two', rating: 4.2, eta: '15–20 min', off: '10% OFF', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
  { name: 'Chai Sutta', slug: 'chai-sutta', cuisine: 'Cafe, Snacks, Beverages', cost: '₹150 for two', rating: 4.6, eta: '10–20 min', off: null, img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop' },
  { name: 'Spice Junction', slug: 'spice-junction', cuisine: 'Chinese, Thai, Asian', cost: '₹400 for two', rating: 4.1, eta: '25–35 min', off: '20% OFF', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop' },
  { name: 'Pizza Planet', slug: 'pizza-planet', cuisine: 'Italian, Pizza, Pasta', cost: '₹500 for two', rating: 4.8, eta: '20–30 min', off: null, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
  { name: 'Sweet Bengal', slug: 'sweet-bengal', cuisine: 'Bengali Sweets, Desserts', cost: '₹150 for two', rating: 4.5, eta: '10–15 min', off: '30% OFF', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop' },
];

const filters = ['Pure Veg', 'Less than 30 min', 'Rating 4.0+', 'Offers'];

export default function RestaurantsPage() {
  return (
    <div className="page-pad">
      <div className="container-z mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-ztext">Restaurants near you</h1>
          <div className="flex items-center gap-3 text-sm text-ztext-light">
            <MapPin size={16} style={{ color: '#E23744' }} />
            <span className="font-medium text-ztext">Kolkata</span>
            <span className="text-ztext-lighter">|</span>
            <span className="text-ztext-lighter">Delivering now</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9C9C9C' }} />
            <input className="input-z pl-10" placeholder="Search for restaurants..." />
          </div>
          <button className="button-z button-z-outline gap-2 text-sm">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {filters.map((f) => (
            <span key={f} className="tag-z">{f}</span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((r) => (
            <Link key={r.slug} href={`/restaurant/${r.slug}`} className="card-z group">
              <div className="relative overflow-hidden">
                <img src={r.img} alt={r.name} className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="delivery-time"><Clock size={12} style={{ display: 'inline', marginRight: 2 }} />{r.eta}</div>
                {r.off && <div className="off-overlay">{r.off}</div>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-ztext text-base truncate">{r.name}</h3>
                  <span className={`rating-badge shrink-0 ${r.rating >= 4.5 ? 'high' : r.rating >= 4.0 ? 'medium' : 'low'}`}>
                    <Star size={10} fill="currentColor" /> {r.rating}
                  </span>
                </div>
                <p className="text-ztext-light text-sm mt-1 truncate">{r.cuisine}</p>
                <p className="text-ztext-lighter text-xs mt-2">{r.cost}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
