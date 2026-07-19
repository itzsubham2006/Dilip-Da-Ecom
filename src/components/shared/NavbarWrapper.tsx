'use client';

import { usePathname } from 'next/navigation';
import OldNavbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return <OldNavbar />;
}
