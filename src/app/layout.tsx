import type { Metadata } from 'next';
import { Providers } from '@/providers';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Toast from '@/components/shared/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Dilip Da',
    default: 'Dilip Da — Food Ordering Platform',
  },
  description: 'Order from your favourite restaurants. Pay with cash, card, or Ethics Pay BNPL.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
