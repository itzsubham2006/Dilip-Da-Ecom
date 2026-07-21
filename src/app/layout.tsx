import type { Metadata } from 'next';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { Lexend } from 'next/font/google';
import { Providers } from '@/providers';
import Footer from '@/components/shared/Footer';
import './globals.css';

const NavbarWrapper = dynamic(() => import('@/components/shared/NavbarWrapper'));
const Toast = dynamic(() => import('@/components/shared/Toast'));

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Dilipda',
    default: 'Dilipda — Homestyle Bengali Meals near CIT Kokrajhar',
  },
  description: 'Dilipda is a homestyle Bengali food service run by Dilip da, serving fresh meals near CIT Kokrajhar. Order online for delivery.',
};

const themeScript = `
  (function() {
    var theme = localStorage.getItem('dilip-da-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
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
        <Script id="theme-init" strategy="beforeInteractive">{themeScript}</Script>
      </head>
      <body className={`${lexend.variable} min-h-screen bg-white font-sans antialiased`}>
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
