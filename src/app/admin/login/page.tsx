'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

// Hardcoded admin credentials — change these as needed
const ADMIN_EMAIL = 'admin@velluto.com';
const ADMIN_PASSWORD = 'Velluto2024!';

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('velluto_admin_auth') === 'true') {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Small delay for realism
    await new Promise((r) => setTimeout(r, 600));

    if (email.toLowerCase().trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('velluto_admin_auth', 'true');
      localStorage.setItem(
        'velluto_admin_user',
        JSON.stringify({
          name: 'Super Admin',
          email: ADMIN_EMAIL,
          role: 'SUPER_ADMIN',
        })
      );
      router.replace('/admin/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Emblem logo */}
        <span className="w-12 h-12 bg-white text-neutral-950 rounded-xl flex items-center justify-center font-bold tracking-wider text-lg mx-auto shadow-xl">
          V
        </span>
        <h2 className="font-display text-3xl font-bold tracking-wider text-white uppercase">
          Velluto Admin
        </h2>
        <p className="text-xs font-light text-neutral-500 uppercase tracking-widest">
          Secure Brand Management Access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 border border-neutral-800 py-8 px-4 shadow-2xl rounded-3xl sm:px-10 space-y-6">
          {error && (
            <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3.5 flex items-start gap-2.5">
              <span className="text-red-400 mt-0.5">
                <Icon name="ExclamationTriangleIcon" size={16} />
              </span>
              <p className="text-xs text-red-300 font-light leading-relaxed">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@velluto.com"
                className="w-full bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 bg-neutral-950 border-neutral-800 rounded text-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>

              <div className="text-xs">
                <span className="text-[10px] font-light text-neutral-600 uppercase tracking-wider">
                  admin@velluto.com
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white hover:bg-neutral-200 text-neutral-950 font-semibold py-3.5 rounded-xl transition-all duration-300 text-xs uppercase tracking-wider focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Hint box */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center space-y-1">
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
              Default Credentials
            </p>
            <p className="text-[10px] text-neutral-400">
              Email: <span className="text-white">admin@velluto.com</span>
            </p>
            <p className="text-[10px] text-neutral-400">
              Password: <span className="text-white">Velluto2024!</span>
            </p>
          </div>

          <div className="border-t border-neutral-800/80 pt-4 text-center">
            <Link
              href="/"
              className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-400 inline-flex items-center gap-1 transition-colors"
            >
              <Icon name="ArrowLeftIcon" size={12} />
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
