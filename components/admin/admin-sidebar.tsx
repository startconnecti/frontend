'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  Video, 
  CreditCard, 
  Undo, 
  Banknote, 
  AlertTriangle, 
  Bell, 
  Shield, 
  Key, 
  FileText, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const navigationGroups = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: ADMIN_ROUTES.DASHBOARD, icon: LayoutDashboard },
    ]
  },
  {
    title: 'User Management',
    items: [
      { label: 'Users', href: ADMIN_ROUTES.USERS, icon: Users },
      { label: 'Tutor Approval', href: ADMIN_ROUTES.TUTORS, icon: UserCheck },
      { label: 'Conversations', href: ADMIN_ROUTES.CONVERSATIONS, icon: MessageSquare },
    ]
  },
  {
    title: 'Learning Operations',
    items: [
      { label: 'Subjects', href: ADMIN_ROUTES.SUBJECTS, icon: BookOpen },
      { label: 'Bookings', href: ADMIN_ROUTES.BOOKINGS, icon: Calendar },
      { label: 'Sessions', href: ADMIN_ROUTES.SESSIONS, icon: Video },
    ]
  },
  {
    title: 'Finance',
    items: [
      { label: 'Payments', href: ADMIN_ROUTES.PAYMENTS, icon: CreditCard },
      { label: 'Refunds', href: ADMIN_ROUTES.REFUNDS, icon: Undo },
      { label: 'Payouts', href: ADMIN_ROUTES.PAYOUTS, icon: Banknote },
      { label: 'Disputes', href: ADMIN_ROUTES.DISPUTES, icon: AlertTriangle },
    ]
  },
  {
    title: 'Communications',
    items: [
      { label: 'Notifications', href: ADMIN_ROUTES.NOTIFICATIONS, icon: Bell },
    ]
  },
  {
    title: 'Administration',
    items: [
      { label: 'Admin Accounts', href: ADMIN_ROUTES.ADMINS, icon: Shield },
      { label: 'Roles & Permissions', href: ADMIN_ROUTES.ROLES, icon: Key },
      { label: 'Audit Logs', href: ADMIN_ROUTES.AUDIT_LOGS, icon: FileText },
      { label: 'System Settings', href: ADMIN_ROUTES.SYSTEM_SETTINGS, icon: Settings },
    ]
  }
];

export function SidebarContent() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newOpenGroups: Record<string, boolean> = { ...openGroups };
    navigationGroups.forEach(group => {
      const isGroupActive = group.items.some(item => 
        pathname === item.href || (item.href !== ADMIN_ROUTES.DASHBOARD && pathname.startsWith(item.href))
      );
      if (isGroupActive) {
        newOpenGroups[group.title] = true;
      }
    });
    // Only update if there's a difference to avoid infinite loops, but simple state setter is fine
    setOpenGroups(prev => ({ ...prev, ...newOpenGroups }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="border-b border-border px-6 py-4 flex-shrink-0">
        <Link href={ADMIN_ROUTES.DASHBOARD} className="flex items-center gap-3">
          <Image src="/connecti-logo-mark.svg" alt="Connecti" width={32} height={32} />
          <span className="text-lg font-bold text-foreground">Connecti Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {navigationGroups.map((group) => (
          <Collapsible
            key={group.title}
            open={openGroups[group.title] !== false} // Default to open unless explicitly closed, or use state
            onOpenChange={() => toggleGroup(group.title)}
            className="space-y-1"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              {group.title}
              {openGroups[group.title] !== false ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== ADMIN_ROUTES.DASHBOARD && pathname.startsWith(item.href));

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4 flex-shrink-0">
        <p className="text-xs text-muted-foreground text-center">Connecti Admin v1.0</p>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
      <SidebarContent />
    </div>
  );
}
