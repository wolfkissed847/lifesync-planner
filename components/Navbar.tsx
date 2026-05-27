/**
 * Navbar.tsx — Navigation component สำหรับ Life Planner
 * Desktop: sidebar ด้านซ้ายพร้อม sub-navigation
 * Mobile: bottom tab bar (ย่อ 5 items)
 * แสดง active state ตาม current path
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Receipt,
  CalendarClock,
  Settings,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useTranslation, TranslationKey } from '@/lib/i18n';

/** รายการ navigation links หลัก (เก็บเฉพาะ keys) */
const navItems = [
  { href: '/', labelKey: 'nav_dashboard' as TranslationKey, icon: LayoutDashboard },
  {
    href: '/budget',
    labelKey: 'nav_budget' as TranslationKey,
    icon: Wallet,
    children: [
      { href: '/budget', labelKey: 'nav_budget_overview' as TranslationKey },
      { href: '/budget/income', labelKey: 'nav_income' as TranslationKey },
      { href: '/budget/expenses', labelKey: 'nav_expenses' as TranslationKey },
    ],
  },
  { href: '/schedule', labelKey: 'nav_schedule' as TranslationKey, icon: CalendarClock },
  { href: '/settings', labelKey: 'nav_settings' as TranslationKey, icon: Settings },
];

/** Mobile tab bar items (ย่อให้พอดี) */
const mobileItems = [
  { href: '/', labelKey: 'nav_home' as TranslationKey, icon: LayoutDashboard },
  { href: '/budget', labelKey: 'nav_budget' as TranslationKey, icon: Wallet },
  { href: '/schedule', labelKey: 'nav_schedule' as TranslationKey, icon: CalendarClock },
  { href: '/settings', labelKey: 'nav_settings' as TranslationKey, icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  /** ตรวจสอบ active state — รองรับ sub-routes */
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border bg-card/50 backdrop-blur-xl fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Life Planner</h1>
            <p className="text-xs text-muted-foreground">{t('nav_subtitle')}</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-primary/15 text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <item.icon className={cn('w-5 h-5', active && 'text-primary')} />
                  {t(item.labelKey)}
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-scale-in" />
                  )}
                </Link>
                {/* Sub-navigation สำหรับ Budget */}
                {item.children && active && (
                  <div className="ml-8 mt-1 space-y-0.5 animate-fade-in">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'block px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                            childActive
                              ? 'text-primary bg-primary/10'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                          )}
                        >
                          {t(child.labelKey)}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            v1.0.0 • ข้อมูลเก็บในเครื่อง
          </p>
          <ThemeToggle />
        </div>
      </aside>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5', active && 'text-primary')} />
                <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
                {active && (
                  <div className="w-4 h-0.5 rounded-full bg-primary animate-scale-in" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
