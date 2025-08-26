'use client';

import { useState } from 'react';
import DashboardLayout from '@/app/components/dashboard/layout/DashboardLayout';
import { Crown, Check, X, Zap, Users, FileText, Plug, Shield, Headphones } from 'lucide-react';

const currentPlan = {
  name: 'Free',
  price: 0,
  meetings: 5,
  used: 2
};

const features = {
  free: [
    { feature: 'Meetings per month', value: '5', available: true },
    { feature: 'Basic AI summaries', value: 'Yes', available: true },
    { feature: 'Export to PDF', value: 'Yes', available: true },
    { feature: 'Advanced AI analysis', value: 'No', available: false },
    { feature: 'Unlimited meetings', value: 'No', available: false },
    { feature: 'All app integrations', value: 'No', available: false },
    { feature: 'Priority support', value: 'No', available: false },
    { feature: 'Custom branding', value: 'No', available: false }
  ],
  premium: [
    { feature: 'Meetings per month', value: 'Unlimited', available: true },
    { feature: 'Basic AI summaries', value: 'Yes', available: true },
    { feature: 'Export to PDF', value: 'Yes', available: true },
    { feature: 'Advanced AI analysis', value: 'Yes', available: true },
    { feature: 'All app integrations', value: 'Yes', available: true },
    { feature: 'Priority support', value: 'Yes', available: true },
    { feature: 'Custom branding', value: 'Yes', available: true },
    { feature: 'API access', value: 'Yes', available: true }
  ]
};

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager at TechCorp',
    quote: 'SupersmartX has saved us hours every week. The AI summaries are incredibly accurate.',
    avatar: 'SJ'
  },
  {
    name: 'Mike Chen',
    role: 'CEO at StartupXYZ',
    quote: 'Game-changer for our remote team. Never miss an action item again.',
    avatar: 'MC'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Operations Lead',
    quote: 'The integrations with Slack and Notion make our workflow seamless.',
    avatar: 'ER'
  }
];

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = {
    free: {
      name: 'Free',
      price: billingCycle === 'monthly' ? 0 : 0,
      originalPrice: null,
      features: features.free,
      popular: false,
      cta: 'Current Plan'
    },
    premium: {
      name: 'Premium',
      price: billingCycle === 'monthly' ? 19 : 190,
      originalPrice: billingCycle === 'monthly' ? null : 228,
      features: features.premium,
      popular: true,
      cta: 'Upgrade Now'
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <Crown className="mx-auto mb-4 text-yellow-400" size={48} />
          <h1 className="text-3xl font-bold mb-2">Upgrade Your Experience</h1>
          <p className="text-gray-400 text-lg">Unlock the full potential of AI-powered meeting analysis</p>
        </div>

        {/* Current Usage */}
        <div className="glass-card max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center">Current Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Meetings Used</span>
                <span className="font-medium">{currentPlan.used} / {currentPlan.meetings}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentPlan.used / currentPlan.meetings) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-400">
              {currentPlan.meetings - currentPlan.used} meetings remaining this month
            </p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="glass rounded-2xl p-2">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-3 rounded-xl font-medium transition-all relative ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  20% off
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(plans).map(([planKey, plan]) => (
            <div
              key={planKey}
              className={`glass-card relative ${
                plan.popular ? 'border-2 border-gradient-to-r from-purple-500 to-pink-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  {plan.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">${plan.originalPrice}/year</div>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.available ? (
                      <Check size={16} className="text-green-400 flex-shrink-0" />
                    ) : (
                      <X size={16} className="text-gray-500 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.available ? 'text-gray-300' : 'text-gray-500'}`}>
                      {feature.feature}: {feature.value}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all ${
                  planKey === 'premium'
                    ? 'gradient-button'
                    : planKey === 'free' && currentPlan.name === 'Free'
                    ? 'glass-button cursor-not-allowed opacity-50'
                    : 'glass-button'
                }`}
                disabled={planKey === 'free' && currentPlan.name === 'Free'}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="glass-card">
          <h3 className="text-2xl font-semibold text-center mb-8">Why Upgrade to Premium?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Zap className="mx-auto mb-4 text-yellow-400" size={32} />
              <h4 className="font-semibold mb-2">Advanced AI Analysis</h4>
              <p className="text-gray-400 text-sm">Get deeper insights with sentiment analysis, speaker identification, and topic clustering</p>
            </div>
            <div className="text-center">
              <Plug className="mx-auto mb-4 text-blue-400" size={32} />
              <h4 className="font-semibold mb-2">All Integrations</h4>
              <p className="text-gray-400 text-sm">Connect with Slack, Notion, WhatsApp, Telegram, and 20+ other apps</p>
            </div>
            <div className="text-center">
              <Headphones className="mx-auto mb-4 text-green-400" size={32} />
              <h4 className="font-semibold mb-2">Priority Support</h4>
              <p className="text-gray-400 text-sm">Get help when you need it with 24/7 priority customer support</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center">What Our Users Say</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Is my data secure?</h4>
              <p className="text-gray-400 text-sm">Absolutely. We use enterprise-grade encryption and never store your meeting recordings permanently.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Do you offer refunds?</h4>
              <p className="text-gray-400 text-sm">We offer a 30-day money-back guarantee if you're not completely satisfied with Premium.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}