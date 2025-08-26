// app/about/page.tsx
'use client';

import { Users, Zap, Lightbulb, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            About SupersmartX
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Empowering teams with AI-driven meeting intelligence and productivity tools.
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Founded in 2023, SupersmartX was born out of a simple observation: too much valuable time is lost in unproductive meetings.
                </p>
                <p>
                  Our team of AI enthusiasts and productivity experts came together to create a solution that transforms the way teams collaborate and extract value from their meetings.
                </p>
                <p>
                  Today, we're proud to serve thousands of users worldwide, helping them save time and focus on what truly matters.
                </p>
              </div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-16 h-16 text-purple-400" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lightbulb className="w-8 h-8 mb-4 text-purple-400" />,
                title: "Innovation",
                description: "We constantly push the boundaries of what's possible with AI to deliver cutting-edge solutions."
              },
              {
                icon: <Users className="w-8 h-8 mb-4 text-pink-400" />,
                title: "User-Centric",
                description: "Our users are at the heart of everything we build and every decision we make."
              },
              {
                icon: <Shield className="w-8 h-8 mb-4 text-purple-400" />,
                title: "Integrity",
                description: "We prioritize security, privacy, and transparency in all our operations."
              }
            ].map((value, index) => (
              <div key={index} className="glass p-6 rounded-xl">
                {value.icon}
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Founder",
                image: "/team/alex.jpg"
              },
              {
                name: "Sarah Chen",
                role: "CTO",
                image: "/team/sarah.jpg"
              },
              {
                name: "Marcus Lee",
                role: "Lead Developer",
                image: "/team/marcus.jpg"
              },
              {
                name: "Elena Rodriguez",
                role: "Product Designer",
                image: "/team/elena.jpg"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Users className="w-16 h-16 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Be part of the future of productive meetings. Try SupersmartX today and experience the difference.
            </p>
            <Link href="/register" className="gradient-button">
              Get Started for Free
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
