'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigationItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Tutor Approval', href: '/admin/tutors', icon: '✓' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Bookings', href: '/admin/bookings', icon: '📅' },
  { label: 'Sessions', href: '/admin/sessions', icon: '🎓' },
  { label: 'Payments', href: '/admin/payments', icon: '💳' },
  { label: 'Refunds', href: '/admin/refunds', icon: '↩️' },
  { label: 'Payouts', href: '/admin/payouts', icon: '💰' },
  { label: 'Disputes', href: '/admin/disputes', icon: '⚠️' },
  { label: 'Conversations', href: '/admin/conversations', icon: '💬' },
  { label: 'Notifications', href: '/admin/notifications', icon: '🔔' },
  { label: 'Subjects', href: '/admin/subjects', icon: '📚' },
  { label: 'Admin Accounts', href: '/admin/admins', icon: '🔐' },
  { label: 'Roles & Permissions', href: '/admin/roles', icon: '🔑' },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: '📋' },
  { label: 'System Settings', href: '/admin/system-settings', icon: '⚙️' },
];

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="border-b border-border px-6 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/connecti-logo-mark.svg" alt="Connecti" width={32} height={32} />
          <span className="text-lg font-bold text-foreground">Connecti Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4">
        <p className="text-xs text-muted-foreground">Connecti Admin v1.0</p>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-40">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
