'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Video, 
  Star, 
  Wallet, 
  ArrowUpRight, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

const tutorNavItems = [
  { label: 'Dashboard', href: ROUTES.TUTOR.DASHBOARD, icon: LayoutDashboard },
  { label: 'My Profile', href: ROUTES.TUTOR.PROFILE, icon: User },
  { label: 'Availability', href: ROUTES.TUTOR.AVAILABILITY, icon: Calendar },
  { label: 'Bookings', href: ROUTES.TUTOR.BOOKINGS, icon: Calendar, disabled: true },
  { label: 'Sessions', href: ROUTES.TUTOR.SESSIONS, icon: Video, disabled: true },
  { label: 'Reviews', href: ROUTES.TUTOR.REVIEWS, icon: Star },
  { label: 'Income', href: ROUTES.TUTOR.INCOME, icon: Wallet, disabled: true },
  { label: 'Payouts', href: ROUTES.TUTOR.PAYOUTS, icon: ArrowUpRight, disabled: true },
  { label: 'Messages', href: ROUTES.MESSAGES, icon: MessageSquare },
  { label: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: 'Settings', href: ROUTES.SETTINGS_PROFILE, icon: Settings },
];

export function TutorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
      <div className="p-6">
        <Link href={ROUTES.HOME} className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight" style={{ color: '#2C1208' }}>Connecti</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {tutorNavItems.map((item) => {
          const isActive = pathname === item.href;
          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/40 cursor-not-allowed select-none"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <span className="ml-auto text-[8px] font-black uppercase tracking-tighter bg-muted px-1.5 py-0.5 rounded border border-border/40">Soon</span>
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-4 w-4', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t mt-auto">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
