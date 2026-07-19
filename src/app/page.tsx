import Link from 'next/link';
import { Search, MapPin, ChevronDown, Star, Clock, ArrowRight } from 'lucide-react';

const categories = [
  { label: 'Pizza', emoji: '🍕', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop' },
  { label: 'Biryani', emoji: '🍛', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=120&h=120&fit=crop' },
  { label: 'Burger', emoji: '🍔', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop' },
  { label: 'Chinese', emoji: '🥡', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=120&h=120&fit=crop' },
  { label: 'South Indian', emoji: '🥞', img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=120&h=120&fit=crop' },
  { label: 'Desserts', emoji: '🍰', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=120&h=120&fit=crop' },
  { label: 'Beverages', emoji: '🥤', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=120&h=120&fit=crop' },
  { label: 'North Indian', emoji: '🍝', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&h=120&fit=crop' },
];

const collections = [
  { title: "Trending This Week", desc: "Most popular restaurants right now", img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
  { title: "Best Biryanis", desc: "Flavorful rice dishes near you", img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop' },
  { title: "Sweet Treats", desc: "Desserts to satisfy your cravings", img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop' },
  { title: "Healthy Bites", desc: "Fresh & nutritious meals", img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
];

const restaurants = [
  { name: 'Punjab Dhaba', cuisine: 'North Indian, Mughlai', cost: '₹300 for two', rating: 4.5, eta: '25–35 min', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
  { name: 'Dosa Express', cuisine: 'South Indian, Kerala', cost: '₹200 for two', rating: 4.3, eta: '20–30 min', img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop' },
  { name: 'Roll Hub', cuisine: 'Fast Food, Rolls', cost: '₹250 for two', rating: 4.7, eta: '15–25 min', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  { name: 'Biryani House', cuisine: 'Mughlai, Lucknowi', cost: '₹350 for two', rating: 4.4, eta: '30–40 min', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop' },
  { name: 'Green Bowl', cuisine: 'Healthy, Salads, Juices', cost: '₹200 for two', rating: 4.2, eta: '15–20 min', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
  { name: 'Chai Sutta', cuisine: 'Cafe, Snacks, Beverages', cost: '₹150 for two', rating: 4.6, eta: '10–20 min', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black/90 to-black/70" style={{ minHeight: '420px' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4 }} />
        <div className="relative container-z mx-auto px-4 flex flex-col items-center justify-center text-center" style={{ minHeight: '420px', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Find the best restaurants near you
          </h1>
          <p className="mt-3 text-white/70 text-base sm:text-lg max-w-xl">Order food from the best restaurants with Ethics Pay BNPL — interest-free credit for students.</p>

          <div className="mt-8 w-full max-w-2xl">
            <div className="hero-search flex-col sm:flex-row">
              <div className="flex items-center w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-zborder px-4">
                <MapPin size={18} style={{ color: '#E23744', flexShrink: 0 }} />
                <select className="h-14 bg-transparent border-none outline-none text-sm font-medium text-ztext px-2 cursor-pointer flex-1">
                  <option>Kolkata</option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Bangalore</option>
                </select>
              </div>
              <div className="flex items-center flex-1 w-full px-4">
                <Search size={18} style={{ color: '#9C9C9C', flexShrink: 0 }} />
                <input className="h-14 bg-transparent border-none outline-none text-sm flex-1 px-3" placeholder="Search for restaurant, cuisine or a dish" />
              </div>
              <button className="w-full sm:w-auto h-14 px-8 bg-zred text-white font-semibold text-sm hover:bg-zred-dark transition-colors">Search</button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-white/60 text-sm">
            <span className="text-white/80">Popular:</span>
            {['Punjabi', 'Biryani', 'Burger', 'Pizza', 'Chinese'].map((t) => (
              <span key={t} className="cursor-pointer hover:text-white transition-colors">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-z mx-auto px-4 section-z animate-in">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {categories.map((c) => (
            <Link key={c.label} href={`/restaurants?cuisine=${c.label.toLowerCase()}`} className="category-chip shrink-0">
              <div className="icon-wrap">
                <img src={c.img} alt={c.label} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="label whitespace-nowrap">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="container-z mx-auto px-4 section-z animate-in">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2>Collections</h2>
            <p className="text-ztext-light text-sm mt-1">Explore curated lists of top restaurants in and around Kolkata</p>
          </div>
          <Link href="/restaurants" className="text-zred text-sm font-semibold hidden sm:flex items-center gap-1 hover:underline underline-offset-2">
            All collections <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {collections.map((c) => (
            <Link key={c.title} href="/restaurants" className="relative rounded-xl overflow-hidden aspect-[4/3] group">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm sm:text-base">{c.title}</h3>
                <p className="text-white/70 text-xs mt-1">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/restaurants" className="sm:hidden flex items-center justify-center gap-1 text-zred text-sm font-semibold mt-4">
          All collections <ArrowRight size={16} />
        </Link>
      </section>

      {/* Restaurants */}
      <section className="container-z mx-auto px-4 section-z animate-in">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2>Popular restaurants near you</h2>
            <p className="text-ztext-light text-sm mt-1">Hand-picked favourites just for you</p>
          </div>
          <Link href="/restaurants" className="text-zred text-sm font-semibold hidden sm:flex items-center gap-1 hover:underline underline-offset-2">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((r) => (
            <Link key={r.name} href={`/restaurant/${r.name.toLowerCase().replace(/\s+/g, '-')}`} className="card-z group">
              <div className="relative overflow-hidden">
                <img src={r.img} alt={r.name} className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="delivery-time"><Clock size={12} style={{ display: 'inline', marginRight: 2 }} />{r.eta}</div>
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
      </section>

      {/* Ethics Pay BNPL Section */}
      <section className="container-z mx-auto px-4 section-z animate-in">
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-zred to-zred-dark px-8 py-12 sm:px-16 text-center sm:text-left">
          <div className="max-w-lg">
            <h2 className="text-3xl sm:text-4xl font-black text-white">Ethics Pay BNPL</h2>
            <p className="mt-3 text-white/80 text-base leading-relaxed">Get up to ₹5,000 credit instantly. Order food now, pay in 15 days. Zero interest, zero hidden fees — built for students.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white text-zred font-bold rounded-lg hover:bg-white/90 transition-colors">Get started</Link>
              <Link href="/about-bnpl" className="inline-flex items-center justify-center gap-2 h-12 px-8 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">Learn more</Link>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
