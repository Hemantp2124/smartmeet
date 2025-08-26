'use client';

import { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaBell, FaUser } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SignOutButton } from '../../Auth/SignOutButton';

type User = {
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
    picture?: string;
  };
};

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [supabase]);

  const userImage = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || 'https://i.pravatar.cc/100?img=12';
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4">
      <div className="glass mt-4 p-3 sm:p-4 rounded-2xl w-full max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-y-3">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SupersmartX
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 relative">
            <button
              onClick={() => setIsDark(!isDark)}
              className="glass-button p-2 sm:p-2.5 rounded-xl"
            >
              {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            <button className="glass-button p-2 sm:p-2.5 rounded-xl relative">
              <FaBell size={18} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </button>

            {/* Avatar button and dropdown */}
            <div className="relative">
              <button
                className="glass-button p-1 sm:p-1.5 rounded-full flex items-center gap-2"
                onClick={() => setShowMenu(!showMenu)}
              >
                <Image
                  src={userImage}
                  alt={userName}
                  width={28}
                  height={28}
                  className="rounded-full w-7 h-7 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://i.pravatar.cc/100?img=12';
                  }}
                />
                <span className="hidden sm:inline text-sm text-white">{userName}</span>
              </button>
              
              {/* Dropdown menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] rounded-lg shadow-lg py-1 z-50 border border-gray-700">
                  <div className="px-4 py-3 text-sm text-gray-300 border-b border-gray-700">
                    <div className="font-medium">{userName}</div>
                    {user?.email && (
                      <div className="text-xs text-gray-400 truncate">{user.email}</div>
                    )}
                  </div>
                  <a 
                    href="/dashboard/profile" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                  >
                    <FaUser size={16} />
                    View Profile
                  </a>
                  <a 
                    href="/settings" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Settings
                  </a>
                  <div className="px-4 py-2">
                    <SignOutButton 
                      variant="ghost" 
                      className="w-full justify-start"
                      showIcon
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
