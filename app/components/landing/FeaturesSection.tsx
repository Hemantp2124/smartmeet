// app/components/landing/FeaturesSection.tsx
'use client';

import { Users, FileText, Zap } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users size={24} />,
              title: "Smart Meeting Analysis",
              description: "AI-powered analysis of your Google Meet sessions with real-time transcription and intelligent insights."
            },
            {
              icon: <FileText size={24} />,
              title: "Automated Reports",
              description: "Generate comprehensive reports with key points, action items, and next steps automatically."
            },
            {
              icon: <Zap size={24} />,
              title: "Seamless Integration",
              description: "Connect with Slack, Notion, WhatsApp, and more to share insights across your workflow."
            }
          ].map((feature, index) => (
            <div key={index} className="glass-card text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
