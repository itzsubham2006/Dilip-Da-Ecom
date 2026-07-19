import type { Metadata } from 'next';
import { Providers } from '@/providers';
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
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
