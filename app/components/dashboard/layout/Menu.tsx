'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, FileText, BookOpen, Plug, Crown } from 'lucide-react';

// ✅ Define type to avoid TS error
type NavItem = {
  href: string;
  icon?: React.ElementType;
  label: string;
  avatar?: boolean;
};

// ✅ Dummy avatar image
const userImage = 'https://i.pravatar.cc/100?img=12';

const navItems: NavItem[] = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/summary', icon: FileText, label: 'Summary' },
  { href: '/dashboard/reports', icon: BookOpen, label: 'Reports' },
  { href: '/dashboard/apps', icon: Plug, label: 'Apps' },
  { href: '/dashboard/upgrade', icon: Crown, label: 'Upgrade' },
  {
    href: '/dashboard/profile',
    icon: undefined,
    label: 'Profile',
    avatar: true, // ✅ Now TypeScript knows this is valid
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar - Only for xl screens and up (1200px+) */}
      <nav className="hidden xl:block fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
        <div className="glass px-3 py-6 rounded-3xl">
          <div className="flex flex-col items-center gap-4">
            {navItems.map(({ href, icon: Icon, label, avatar }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all duration-200 w-full ${
                    isActive
                      ? 'bg-gradient-to-b from-purple-500 to-pink-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {avatar ? (
                    <Image
                      src={userImage}
                      alt="User Avatar"
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    Icon && <Icon size={20} />
                  )}
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Nav - For screens up to 1200px (including 1024px) */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-black/30">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ href, icon: Icon, label, avatar }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 text-[11px] px-2 transition-all ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {avatar ? (
                  <Image
                    src={userImage}
                    alt="User Avatar"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                ) : (
                  Icon && <Icon size={18} />
                )}
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
