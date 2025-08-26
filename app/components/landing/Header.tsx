'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              smartmeet
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-gray-300 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
              Features
            </Link>
            <Link href="/#pricing" className="text-gray-300 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-gray-300 hover:text-white hover:bg-white/5">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link href="/register">Get Started</Link>
            </Button>
           
          </div>
        </div>
      </div>
    </header>
  );
}
