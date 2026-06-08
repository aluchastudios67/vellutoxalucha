'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Emblem logo */}
        <span className="w-12 h-12 bg-white text-neutral-950 rounded-xl flex items-center justify-center font-bold tracking-wider text-lg mx-auto shadow-xl">
          V
        </span>
        <h2 className="font-display text-3xl font-bold tracking-wider text-white uppercase">
          Password Recovery
        </h2>
        <p className="text-xs font-light text-neutral-500 uppercase tracking-widest">
          Reset administrative login credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 border border-neutral-800 py-8 px-4 shadow-2xl rounded-3xl sm:px-10 space-y-6">
          {isSubmitted ? (
            <div className="space-y-4 text-center animate-fade-in">
              <div className="w-12 h-12 bg-neutral-800 text-white rounded-full flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                Reset Request Logged
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                An administrator recovery request has been logged for{' '}
                <strong className="text-white font-medium">{email}</strong>. For local/development
                mode safety, please consult the database seed or contact your Super Admin to
                retrieve or override credentials directly.
              </p>
              <div className="pt-4">
                <a
                  href="/admin/login"
                  className="inline-flex items-center justify-center bg-white hover:bg-neutral-200 text-neutral-950 font-semibold px-6 py-3 rounded-xl transition-all duration-300 text-xs uppercase tracking-wider"
                >
                  Return to Login
                </a>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Enter your registered admin email address below. We will send verification links or
                log password override details.
              </p>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Admin Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@velluto.com"
                  className="w-full bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-neutral-200 text-neutral-950 font-semibold py-3.5 rounded-xl transition-all duration-300 text-xs uppercase tracking-wider focus:outline-none disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Send Recovery Instructions'}
                </button>
              </div>

              <div className="border-t border-neutral-800/80 pt-4 text-center">
                <a
                  href="/admin/login"
                  className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-400 inline-flex items-center gap-1 transition-colors"
                >
                  <Icon name="ArrowLeftIcon" size={12} />
                  Return to Login
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
