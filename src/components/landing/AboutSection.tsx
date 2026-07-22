'use client';

import { MapPin, Phone, Clock } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-5 sm:py-8 bg-zbg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-base sm:text-lg font-bold text-ztext mb-3">
          About <span className="text-zred">Dilip Da</span>
        </h2>

        <div className="bg-zcard rounded-xl border border-zborder p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-ztext-light leading-relaxed">
            Homestyle Bengali food service near CIT Kokrajhar&apos;s 2nd gate.
            Fresh, authentic meals cooked with love — from classic fish curry to evening chai.
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zgray flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-zred" />
              </div>
              <div>
                <p className="font-semibold text-ztext text-xs">Location</p>
                <p className="text-[11px] text-ztext-light">Near CIT Kokrajhar, 2nd Gate</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zgray flex items-center justify-center shrink-0">
                <Clock size={14} className="text-zred" />
              </div>
              <div>
                <p className="font-semibold text-ztext text-xs">Hours</p>
                <p className="text-[11px] text-ztext-light">10:00 AM – 10:00 PM (Mon–Sun)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zgray flex items-center justify-center shrink-0">
                <Phone size={14} className="text-zred" />
              </div>
              <div>
                <p className="font-semibold text-ztext text-xs">Contact</p>
                <p className="text-[11px] text-ztext-light">6000212823</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
