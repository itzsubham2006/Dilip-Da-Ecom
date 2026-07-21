import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Providers } from '@/providers';
import Footer from '@/components/shared/Footer';
import './globals.css';

const NavbarWrapper = dynamic(() => import('@/components/shared/NavbarWrapper'));
const Toast = dynamic(() => import('@/components/shared/Toast'));

export const metadata: Metadata = {
  title: {
    template: '%s | Dilip Da',
    default: 'Dilip Da — Homestyle Bengali Meals near CIT Kokrajhar',
  },
  description: 'Dilip Da is a homestyle Bengali food service run by Dilip da, serving fresh meals near CIT Kokrajhar. Order online for delivery.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light-mode')})()` }} />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://videos.pexels.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://videos.pexels.com" />
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop"
        />
      </head>
      <body className="min-h-screen bg-zbg font-sans antialiased">
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
