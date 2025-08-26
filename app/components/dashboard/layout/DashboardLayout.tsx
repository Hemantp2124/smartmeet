'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Header from './Header';
import BottomNav from './Menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen text-[#ffffff] pb-24 pt-28 overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/vila.jpg"
          alt="Background"
          fill
          priority
          quality={100}
          className="object-cover"
          style={{
            filter: 'brightness(0.4)'
          }}
        />
        {/* <div className="absolute inset-0 bg-[#0D1117]/90" /> */}
      </div>
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-32 space-y-6 py-4">
        <div className="w-full">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
