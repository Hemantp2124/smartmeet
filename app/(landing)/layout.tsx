'use client';

import { Header } from '@/app/components/landing/Header';
import { Footer } from '@/app/components/landing/Footer';

// app/(pages)/layout.tsx
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}