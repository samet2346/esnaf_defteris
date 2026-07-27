'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, PlusCircle, ClipboardList, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS: Array<{
  href: string;
  label: string;
  icon: typeof Home;
  emphasize?: boolean;
}> = [
  { href: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { href: '/customers', label: 'Müşteriler', icon: Users },
  { href: '/jobs/new', label: 'Yeni İş', icon: PlusCircle, emphasize: true },
  { href: '/jobs', label: 'Geçmiş', icon: ClipboardList },
  { href: '/profile', label: 'Profil', icon: User },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hideMenuPages = ['/', '/login', '/register', '/forgot-password', '/privacy', '/terms', '/contact'];
  const shouldShowMenu = !hideMenuPages.includes(pathname);

  const isActive = (path: string) =>
    pathname === path || (path !== '/dashboard' && pathname.startsWith(path + '/'));

  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        {shouldShowMenu && (
          <header className="bg-blue-600 text-white sticky top-0 z-40 shadow-md">
            <div className="app-shell px-4 py-3 md:py-0 md:h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <h1 className="text-xl font-bold tracking-wide shrink-0">DEFTER</h1>
                {/* Desktop yatay menü */}
                <nav className="hidden md:flex items-center gap-1 ml-4 lg:ml-8">
                  {NAV_ITEMS.map(({ href, label, icon: Icon, emphasize }) => {
                    const active = isActive(href);
                    if (emphasize) {
                      return (
                        <Link
                          key={href}
                          href={href}
                          className="touch-target inline-flex items-center gap-2 px-4 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors"
                        >
                          <Icon size={18} />
                          {label}
                        </Link>
                      );
                    }
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`touch-target inline-flex items-center gap-2 px-3 lg:px-4 rounded-xl text-sm transition-colors ${
                          active ? 'bg-blue-500/60 font-semibold' : 'text-blue-100 hover:bg-blue-500/40 hover:text-white'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="hidden lg:inline">{label}</span>
                        <span className="lg:hidden">{label.split(' ')[0]}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  E
                </div>
                {/* Tablet hamburger (md altında bottom nav var; md–lg arası ekstra menü gerekmez ama sm için) */}
                <button
                  type="button"
                  className="md:hidden touch-target inline-flex items-center justify-center rounded-xl bg-blue-500/50"
                  aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                  onClick={() => setMobileMenuOpen((v) => !v)}
                >
                  {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>

            {/* Mobil açılır menü (hamburger) — bottom nav'a ek alternatif */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-blue-500/40 bg-blue-700 px-4 py-3 space-y-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`touch-target flex items-center gap-3 px-3 rounded-xl text-sm ${
                      isActive(href) ? 'bg-blue-500 font-semibold' : 'hover:bg-blue-600'
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </header>
        )}

        <main className={shouldShowMenu ? 'p-4 pb-28 md:pb-8' : ''}>
          <div className={shouldShowMenu ? 'app-shell' : ''}>{children}</div>
        </main>

        {/* Mobil alt menü — sadece < md */}
        {shouldShowMenu && (
          <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 flex justify-around items-center pt-1 pb-safe-bottom z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <Link
              href="/dashboard"
              className={`touch-target flex flex-col items-center justify-center gap-0.5 w-16 ${
                isActive('/dashboard') ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              <Home size={22} />
              <span className="text-[10px]">Ana Sayfa</span>
            </Link>

            <Link
              href="/customers"
              className={`touch-target flex flex-col items-center justify-center gap-0.5 w-16 ${
                isActive('/customers') ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              <Users size={22} />
              <span className="text-[10px]">Müşteriler</span>
            </Link>

            <Link href="/jobs/new" className="flex flex-col items-center -mt-5">
              <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg border-4 border-slate-50 min-h-14 min-w-14 flex items-center justify-center">
                <PlusCircle size={28} />
              </div>
              <span className="text-[10px] text-blue-600 mt-0.5 font-medium">Yeni İş</span>
            </Link>

            <Link
              href="/jobs"
              className={`touch-target flex flex-col items-center justify-center gap-0.5 w-16 ${
                isActive('/jobs') ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              <ClipboardList size={22} />
              <span className="text-[10px]">Geçmiş</span>
            </Link>

            <Link
              href="/profile"
              className={`touch-target flex flex-col items-center justify-center gap-0.5 w-16 ${
                isActive('/profile') ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              <User size={22} />
              <span className="text-[10px]">Profil</span>
            </Link>
          </nav>
        )}
      </body>
    </html>
  );
}
