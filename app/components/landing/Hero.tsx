// app/components/landing/Hero.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Transform Your Meetings with AI
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Get intelligent summaries, action items, and reports from your Google Meet sessions. 
          Save hours of manual work with SupersmartX.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="gradient-button text-lg">
            <Link href="/dashboard">
              Start Free Trial
            </Link>
          </Button>
          <Button variant="outline" className="text-lg">
            <Play className="w-4 h-4 mr-2" />
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
