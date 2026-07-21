import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-z">
      <div className="container-z mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h2 className="font-bold text-ztext mb-4 text-sm uppercase tracking-wider">About</h2>
            <div className="space-y-2 text-sm text-ztext-light">
              <p className="cursor-pointer hover:text-ztext">About Us</p>
              <p className="cursor-pointer hover:text-ztext">Team</p>
              <p className="cursor-pointer hover:text-ztext">Careers</p>
              <p className="cursor-pointer hover:text-ztext">Blog</p>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-ztext mb-4 text-sm uppercase tracking-wider">Learn More</h2>
            <div className="space-y-2 text-sm text-ztext-light">
              <Link href="/privacy" className="block hover:text-ztext">Privacy</Link>
              <Link href="/security" className="block hover:text-ztext">Security</Link>
              <Link href="/terms" className="block hover:text-ztext">Terms</Link>
              <Link href="/sitemap" className="block hover:text-ztext">Sitemap</Link>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-ztext mb-4 text-sm uppercase tracking-wider">Social</h2>
            <div className="space-y-2 text-sm text-ztext-light">
              <p className="cursor-pointer hover:text-ztext">Instagram</p>
              <p className="cursor-pointer hover:text-ztext">Twitter / X</p>
              <p className="cursor-pointer hover:text-ztext">LinkedIn</p>
              <p className="cursor-pointer hover:text-ztext">YouTube</p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-zborder text-center text-sm text-ztext-lighter">
          <span className="font-bold text-zred">dilipda</span> &mdash; Order food. Pay fair.
        </div>
      </div>
    </footer>
  );
}
