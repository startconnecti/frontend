'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, BookOpen, History } from 'lucide-react';
import { PageContainer, SectionHeader } from '@/components/shared';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const navItems = [
    { label: 'Profile', href: '/settings/profile', icon: User },
    { label: 'Password', href: '/settings/password', icon: Lock },
  ];

  if (user?.role === 'student') {
    navItems.push({
      label: 'Student Profile',
      href: '/settings/student-profile',
      icon: BookOpen,
    });
  }

  if (user?.role === 'tutor') {
    navItems.push({
      label: 'Tutor Profile',
      href: '/settings/tutor-profile',
      icon: BookOpen,
    });
    navItems.push({
      label: 'Change Requests',
      href: '/settings/tutor-profile/change-requests',
      icon: History,
    });
  }

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader 
        title="Settings"
        description="Manage your account preferences and security settings."
      />

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
