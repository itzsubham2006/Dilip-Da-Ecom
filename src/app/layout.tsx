import type { Metadata } from 'next';
import { Providers } from '@/providers';
import NavbarWrapper from '@/components/shared/NavbarWrapper';
import Footer from '@/components/shared/Footer';
import Toast from '@/components/shared/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Dilip Da',
    default: 'Dilip Da — Homestyle Bengali Cuisine',
  },
  description: 'Authentic Bengali food cooked with love. Order from Dilip Da. Pay with Ethics Pay BNPL.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen bg-white font-sans antialiased">
        <Providers>
          <NavbarWrapper />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
