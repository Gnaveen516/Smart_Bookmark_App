'use client';

import { createClient } from '@/lib/supabase/client';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="glass-effect border-0 border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Smart Bookmarks</h1>
              <p className="text-xs text-gray-600">Your personal link library</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/50 border border-white/20">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {user.email?.[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-white/50 hover:bg-white/80 rounded-xl transition-all disabled:opacity-50 border border-white/20 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  <span>Logging out...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
