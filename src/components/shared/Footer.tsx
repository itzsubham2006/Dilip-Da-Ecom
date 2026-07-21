import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-z bg-zcard border-t border-white/10">
      <div className="container-z mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">About</h2>
            <div className="space-y-2 text-sm text-white/60">
              <p className="cursor-pointer hover:text-white transition-colors">About Us</p>
              <p className="cursor-pointer hover:text-white transition-colors">Team</p>
              <p className="cursor-pointer hover:text-white transition-colors">Careers</p>
              <p className="cursor-pointer hover:text-white transition-colors">Blog</p>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Learn More</h2>
            <div className="space-y-2 text-sm text-white/60">
              <Link href="/privacy" className="block hover:text-white transition-colors">Privacy</Link>
              <Link href="/security" className="block hover:text-white transition-colors">Security</Link>
              <Link href="/terms" className="block hover:text-white transition-colors">Terms</Link>
              <Link href="/sitemap" className="block hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Social</h2>
            <div className="space-y-2 text-sm text-white/60">
              <p className="cursor-pointer hover:text-white transition-colors">Instagram</p>
              <p className="cursor-pointer hover:text-white transition-colors">Twitter / X</p>
              <p className="cursor-pointer hover:text-white transition-colors">LinkedIn</p>
              <p className="cursor-pointer hover:text-white transition-colors">YouTube</p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-white/40">
          <span className="font-bold text-zred">Dilip Da</span> &mdash; Order food. Pay fair.
        </div>
      </div>
    </footer>
  );
}
