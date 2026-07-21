import Link from 'next/link';
import { Bike, CheckCircle, Clock, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Track Order' };

const steps = [
  { label: 'Order placed', time: '12:25 PM', done: true },
  { label: 'Order confirmed', time: '12:27 PM', done: true },
  { label: 'Being prepared', time: '12:30 PM', done: true },
  { label: 'Out for delivery', time: 'Estimated 12:50 PM', done: false },
  { label: 'Delivered', time: 'Estimated 1:00 PM', done: false },
];

export default function TrackOrderPage() {
  return (
    <div className="page-pad">
      <div className="container-z mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-ztext">Track order</h1>
        <p className="text-ztext-light text-sm mt-1">DD-X7K2L9P • from Dilip Da</p>

        <div className="bg-zcard rounded-xl shadow-z p-6 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 text-zred">
              <Bike size={20} />
            </div>
            <div>
              <p className="font-semibold text-ztext text-sm">Your order is being prepared</p>
              <p className="text-xs text-ztext-light mt-0.5">Expected delivery in 25–35 minutes</p>
            </div>
          </div>
        </div>

        <div className="bg-zcard rounded-xl shadow-z p-6 mt-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex gap-4 pb-6 last:pb-0 relative">
              {i < steps.length - 1 && <div className={`absolute left-[11px] top-7 bottom-0 w-0.5 ${s.done ? 'bg-zgreen' : 'bg-zborder'}`} />}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${s.done ? 'bg-zgreen text-white' : 'bg-zgray text-ztext-lighter'}`}>
                {s.done ? <CheckCircle size={14} /> : <Clock size={14} />}
              </div>
              <div className="flex-1 -mt-0.5">
                <p className={`text-sm font-medium ${s.done ? 'text-ztext' : 'text-ztext-lighter'}`}>{s.label}</p>
                <p className={`text-xs mt-0.5 ${s.done ? 'text-ztext-light' : 'text-ztext-lighter'}`}>{s.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-zcard rounded-xl shadow-z p-6 mt-4 flex items-center gap-3">
          <MapPin size={18} className="text-zred" />
          <div>
            <p className="font-semibold text-ztext text-sm">Delivering to</p>
            <p className="text-xs text-ztext-light">Sector V, Salt Lake, Kolkata</p>
          </div>
        </div>

        <Link href="/" className="button-z button-z-outline w-full mt-6 h-12">Order again</Link>
      </div>
    </div>
  );
}
