/**
 * layout.tsx — Root layout สำหรับ Life Planner App
 * - Google Font: Noto Sans Thai + Inter
 * - Dark theme default
 * - Navbar + responsive layout wrapper
 */
import type { Metadata } from 'next';
import { Noto_Sans_Thai, Inter } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navbar from '@/components/Navbar';
import './globals.css';

/** Noto Sans Thai สำหรับข้อความไทย */
const notoSansThai = Noto_Sans_Thai({
  variable: '--font-sans',
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

/** Inter สำหรับตัวเลขและภาษาอังกฤษ */
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Life Planner — จัดการชีวิต งบประมาณ และตารางเวลา',
  description: 'แอปวางแผนชีวิต รวมระบบจัดการงบประมาณและตารางเวลาในที่เดียว',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} ${inter.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Navbar />
            {/* Main content area — offset for sidebar on desktop, bottom bar on mobile */}
            <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {children}
              </div>
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
