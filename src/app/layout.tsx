import type { Metadata } from 'next';
import Script from 'next/script';
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
        <Script id="theme-init" strategy="beforeInteractive">{themeScript}</Script>
      </head>
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
