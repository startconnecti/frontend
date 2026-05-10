'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Bell, Shield } from 'lucide-react';
import { PageContainer, SectionHeader } from '@/components/shared';
import { cn } from '@/lib/utils';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: 'Profile', href: '/settings/profile', icon: User },
  { label: 'Password', href: '/settings/password', icon: Lock },
  { label: 'Notifications', href: '#', icon: Bell, disabled: true },
  { label: 'Security', href: '#', icon: Shield, disabled: true },
];

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader 
        title="Settings"
        description="Manage your account preferences and security settings."
      />

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.label}
                  href={item.disabled ? '#' : item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 max-w-2xl">
          {children}
        </main>
      </div>
    </PageContainer>
  );
}
