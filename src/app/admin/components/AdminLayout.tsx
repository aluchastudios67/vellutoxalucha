'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface SidebarItem {
  name: string;
  path: string;
  iconName: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', iconName: 'ChartBarIcon' },
  { name: 'Products', path: '/admin/products', iconName: 'ShoppingBagIcon' },
  { name: 'Orders', path: '/admin/orders', iconName: 'ClipboardDocumentListIcon' },
  { name: 'Customers', path: '/admin/customers', iconName: 'UsersIcon' },
  { name: 'Content Editor', path: '/admin/content', iconName: 'DocumentTextIcon' },
  { name: 'Media Library', path: '/admin/media', iconName: 'PhotoIcon' },
  { name: 'Marketing', path: '/admin/marketing', iconName: 'TagIcon' },
  { name: 'Analytics', path: '/admin/analytics', iconName: 'PresentationChartLineIcon' },
  { name: 'Notifications', path: '/admin/notifications', iconName: 'BellIcon' },
  { name: 'Settings', path: '/admin/settings', iconName: 'Cog6ToothIcon' },
];

function handleLogout(router: ReturnType<typeof useRouter>) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('velluto_admin_auth');
    localStorage.removeItem('velluto_admin_user');
  }
  router.replace('/admin/login');
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(
    null
  );

  useEffect(() => {
    // Auth guard
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('velluto_admin_auth') !== 'true') {
        router.replace('/admin/login');
        return;
      }
      const userStr = localStorage.getItem('velluto_admin_user');
      if (userStr) {
        try {
          setAdminUser(JSON.parse(userStr));
        } catch {
          // Ignore json parsing error
        }
      }
      // Dark mode
      const isDark =
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark';
      if (isDark) {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
      }
    }
  }, [router]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    return parts.map((part, index) => {
      const path = '/' + parts.slice(0, index + 1).join('/');
      const isLast = index === parts.length - 1;
      const formattedName = part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ');

      return (
        <React.Fragment key={path}>
          {index > 0 && <span className="text-neutral-300 dark:text-neutral-700">/</span>}
          {isLast ? (
            <span className="text-neutral-900 dark:text-white font-medium text-xs uppercase tracking-wider">
              {formattedName}
            </span>
          ) : (
            <a
              href={path}
              className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-xs uppercase tracking-wider"
            >
              {formattedName}
            </a>
          )}
        </React.Fragment>
      );
    });
  };

  const userInitials = adminUser?.name?.slice(0, 2).toUpperCase() || 'AD';
  const userRole = adminUser?.role?.replace('_', ' ') || 'SUPER ADMIN';

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-white flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-neutral-900 dark:bg-neutral-950 border-r border-neutral-800 dark:border-neutral-900 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-800 dark:border-neutral-900">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-white text-neutral-950 rounded flex items-center justify-center font-bold tracking-wider text-xs">
                V
              </span>
              <span className="font-display font-bold text-sm tracking-[0.2em] uppercase">
                Velluto
              </span>
            </div>
          ) : (
            <span className="w-7 h-7 bg-white text-neutral-950 rounded flex items-center justify-center font-bold tracking-wider text-xs mx-auto">
              V
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <Icon name={isSidebarOpen ? 'ChevronLeftIcon' : 'Bars3Icon'} size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 space-y-1.5 px-3 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                  isActive
                    ? 'bg-white text-neutral-950 dark:bg-neutral-800 dark:text-white font-bold'
                    : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                }`}
              >
                <Icon name={item.iconName} size={18} />
                {isSidebarOpen && <span>{item.name}</span>}
              </a>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800 dark:border-neutral-900">
          <button
            onClick={() => handleLogout(router)}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-neutral-400 hover:bg-red-950/20 hover:text-red-400 transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            <Icon name="ArrowLeftOnRectangleIcon" size={18} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-neutral-950/60" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative w-64 bg-neutral-900 text-white flex flex-col z-10">
            <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-white text-neutral-950 rounded flex items-center justify-center font-bold tracking-wider text-xs">
                  V
                </span>
                <span className="font-display font-bold text-sm tracking-[0.2em] uppercase">
                  Velluto
                </span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>
            <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-white text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                    }`}
                  >
                    <Icon name={item.iconName} size={18} />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </nav>
            <div className="p-4 border-t border-neutral-800">
              <button
                onClick={() => handleLogout(router)}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-neutral-400 hover:bg-red-950/20 hover:text-red-400 transition-colors text-xs font-semibold uppercase tracking-wider"
              >
                <Icon name="ArrowLeftOnRectangleIcon" size={18} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="h-20 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-900 sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Mobile menu toggle & Breadcrumbs */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Icon name="Bars3Icon" size={20} />
              </button>
              <div className="hidden sm:flex items-center gap-2">{getBreadcrumbs()}</div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-4">
              {/* Light/Dark Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle Theme"
              >
                <Icon name={darkMode ? 'SunIcon' : 'MoonIcon'} size={18} />
              </button>

              {/* Notifications Link */}
              <a
                href="/admin/notifications"
                className="relative p-2.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Icon name="BellIcon" size={18} />
              </a>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {userInitials}
                  </div>
                  <div className="hidden md:block text-left pr-1">
                    <p className="text-xs font-semibold text-neutral-800 dark:text-white leading-tight">
                      {adminUser?.name || 'Super Admin'}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500">
                      {userRole}
                    </p>
                  </div>
                  <Icon name="ChevronDownIcon" size={12} className="text-neutral-400" />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                        <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                          {adminUser?.name || 'Super Admin'}
                        </p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                          {adminUser?.email || 'admin@velluto.com'}
                        </p>
                      </div>
                      <div className="py-1">
                        <a
                          href="/admin/settings"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                          <Icon name="Cog6ToothIcon" size={14} />
                          Store Settings
                        </a>
                        <Link
                          href="/"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                          <Icon name="HomeIcon" size={14} />
                          View Storefront
                        </Link>
                      </div>
                      <div className="border-t border-neutral-100 dark:border-neutral-800 py-1">
                        <button
                          onClick={() => handleLogout(router)}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                        >
                          <Icon name="ArrowLeftOnRectangleIcon" size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
