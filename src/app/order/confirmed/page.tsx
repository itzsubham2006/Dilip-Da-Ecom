'use client';

import { CheckCircle, Bike, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmedPage() {
  return (
    <div className="page-pad">
      <div className="container-z mx-auto max-w-lg text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-zgreen">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-ztext mt-6">Order placed!</h1>
        <p className="text-ztext-light mt-2">Your order has been received and is being prepared.</p>

        <div className="bg-zcard rounded-xl shadow-z p-6 mt-8 text-left">
          <div className="flex items-center gap-3 text-sm">
              <Bike size={18} className="text-zred" />
            <div>
              <p className="font-semibold text-ztext">Delivery partner will be assigned soon</p>
              <p className="text-xs text-ztext-light mt-0.5">Expected delivery in 25–35 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm mt-4 pt-4 border-t border-zborder">
              <MapPin size={18} className="text-zred" />
            <div>
              <p className="font-semibold text-ztext">Delivering to</p>
              <p className="text-xs text-ztext-light mt-0.5">Sector V, Salt Lake, Kolkata</p>
            </div>
          </div>
        </div>

        <div className="bg-zcard rounded-xl shadow-z p-6 mt-4">
          <p className="text-sm text-ztext-light">Tracking code</p>
          <p className="text-2xl font-black text-ztext tracking-wider mt-1">DD-X7K2L9P</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link href="/order/track" className="button-z button-z-primary flex-1 h-12">Track order</Link>
          <Link href="/" className="button-z button-z-outline flex-1 h-12">Order again</Link>
        </div>
      </div>
    </div>
  );
}
