import { ArrowUpRight, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-ink text-stone">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="font-display text-3xl font-black">Dilip Da</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone/68">
            Order from your favourite restaurants. Pay with cash, card, or Ethics Pay BNPL.
          </p>
        </div>
        <div className="grid gap-2 text-sm">
          <Link className="footer-link" href="/restaurants">
            Restaurants <ArrowUpRight size={14} />
          </Link>
          <Link className="footer-link" href="/track">
            Track order <ArrowUpRight size={14} />
          </Link>
          <Link className="footer-link" href="/cart">
            Cart <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid content-start gap-3 text-sm text-stone/72">
          <span className="inline-flex items-center gap-2">
            <Mail size={16} /> hello@dilipda.local
          </span>
        </div>
      </div>
    </footer>
  );
}
