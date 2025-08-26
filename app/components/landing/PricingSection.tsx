'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

export function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        '5 meetings per month',
        'Basic AI summaries',
        'Export to PDF'
      ],
      cta: 'Get Started',
      ctaLink: '/dashboard',
      popular: false
    },
    {
      name: 'Premium',
      price: '$19',
      features: [
        'Unlimited meetings',
        'Advanced AI analysis',
        'All integrations',
        'Priority support'
      ],
      cta: 'Upgrade Now',
      ctaLink: '/pricing',
      popular: true
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`glass-card p-8 relative ${
                plan.popular ? 'border-2 border-transparent bg-gradient-to-br from-purple-500/10 to-pink-500/10' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-3xl font-bold mb-6">
                {plan.price}<span className="text-lg font-normal text-gray-400">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={16} className="text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href={plan.ctaLink}
                className={`${
                  plan.popular 
                    ? 'gradient-button' 
                    : 'glass-button'
                } w-full text-center block`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
