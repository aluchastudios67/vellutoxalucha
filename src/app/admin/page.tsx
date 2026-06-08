'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn =
      typeof window !== 'undefined' && localStorage.getItem('velluto_admin_auth') === 'true';

    if (isLoggedIn) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-4">
      <span className="w-12 h-12 bg-white text-neutral-950 rounded-xl flex items-center justify-center font-bold tracking-wider text-lg shadow-xl animate-pulse">
        V
      </span>
      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  );
}
