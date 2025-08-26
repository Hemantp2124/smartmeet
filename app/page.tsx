'use client';

import { Header } from '@/app/components/landing/Header';
import { Hero } from '@/app/components/landing/Hero';
import { FeaturesSection } from '@/app/components/landing/FeaturesSection';
import { PricingSection } from '@/app/components/landing/PricingSection';
import { Footer } from '@/app/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <Header />

      <Hero />

      <FeaturesSection />

      <PricingSection />

      <Footer />
    </div>
  );
}