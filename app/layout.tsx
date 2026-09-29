import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Toast } from '@/components/ui/Toast';
import { SSEListener } from '@/components/ui/SSEListener';

export const metadata: Metadata = {
  title: 'Murmur — Hear the machine before it screams',
  description: 'Smart Factory & IoT Predictive Prevention Engine. Catch micro-drifts before threshold failure.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#07090F] text-gray-100 antialiased selection:bg-cyan-500 selection:text-black">
        <SSEListener />
        <Navbar />
        <main className="min-h-[calc(100vh-4rem-4rem)]">{children}</main>
        <Toast />
        <Footer />
      </body>
    </html>
  );
}
