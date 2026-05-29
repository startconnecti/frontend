'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Bell, MessageSquare, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNotificationUnreadCountQuery } from '@/features/notifications/hooks/use-notification-unread-count-query';
import { useMessageUnreadCountQuery } from '@/features/messages/hooks/use-message-unread-count-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { label: 'Find Tutors', href: ROUTES.DISCOVER },
  { label: 'How It Works', href: ROUTES.HOW_IT_WORKS },
  { label: 'Become a Tutor', href: ROUTES.BECOME_A_TUTOR },
];

export function PublicHeader() {
  const { isAuthenticated, user, isHydrated, logout } = useAuthStore();
  const dashboardUrl = user?.role === 'tutor' ? ROUTES.TUTOR_DASHBOARD : ROUTES.STUDENT_DASHBOARD;

  const { data: notificationData } = useNotificationUnreadCountQuery();
  const { data: messageData } = useMessageUnreadCountQuery();

  const unreadNotificationCount = notificationData?.count ?? 0;
  const unreadMessageCount = messageData?.count ?? 0;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const renderBadge = (count: number) => {
    if (count <= 0) return null;
    const displayCount = count > 99 ? '99+' : count.toString();
    return (
      <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground transform translate-x-1/4 -translate-y-1/4">
        {displayCount}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo Area */}
        <div className="flex items-center gap-8">
          <Link href={ROUTES.HOME} className="flex items-center gap-3 shrink-0">
            <Image src="/connecti-logo-mark.svg" alt="Connecti" width={32} height={32} />
            <span className="text-xl font-bold tracking-tight text-brand-dark">Connecti</span>
          </Link>
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isHydrated && isAuthenticated ? (
            <div className="flex items-center gap-x-3 lg:gap-x-5">
              <Button variant="ghost" size="icon" className="text-muted-foreground relative" aria-label="Messages" asChild>
                <Link href={ROUTES.MESSAGES}>
                  <MessageSquare className="h-5 w-5" />
                  {renderBadge(unreadMessageCount)}
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="text-muted-foreground relative" aria-label="Notifications" asChild>
                <Link href={ROUTES.NOTIFICATIONS}>
                  <Bell className="h-5 w-5" />
                  {renderBadge(unreadNotificationCount)}
                </Link>
              </Button>

              <div className="h-6 w-px bg-border mx-2" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-border hover:border-primary/50 transition-colors">
                      <AvatarImage src={user?.avatarUrl || ''} />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {user?.fullName ? getInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardUrl} className="cursor-pointer flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link href={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm" className="font-medium">Log in</Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button size="sm" className="font-medium bg-primary text-primary-foreground hover:opacity-90">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xs overflow-y-auto">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium py-2 border-b border-border"
                  >
                    {link.label}
                  </Link>
                ))}
                
                {isHydrated && isAuthenticated && (
                  <>
                    <Link href={ROUTES.MESSAGES} className="flex items-center justify-between text-lg font-medium py-2 border-b border-border">
                      <span>Messages</span>
                      {unreadMessageCount > 0 && (
                        <span className="flex h-5 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">
                          {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                        </span>
                      )}
                    </Link>
                    <Link href={ROUTES.NOTIFICATIONS} className="flex items-center justify-between text-lg font-medium py-2 border-b border-border">
                      <span>Notifications</span>
                      {unreadNotificationCount > 0 && (
                        <span className="flex h-5 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">
                          {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                <div className="flex flex-col gap-3 pt-4">
                  {isHydrated && isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 mb-2 px-2">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={user?.avatarUrl || ''} />
                          <AvatarFallback className="bg-primary/5 text-primary">
                            {user?.fullName ? getInitials(user.fullName) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{user?.fullName}</span>
                          <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                        </div>
                      </div>
                      <Link href={dashboardUrl} className="w-full">
                        <Button className="w-full font-bold">Dashboard</Button>
                      </Link>
                      <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" onClick={logout}>
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href={ROUTES.LOGIN} className="w-full">
                        <Button variant="outline" className="w-full">Log in</Button>
                      </Link>
                      <Link href={ROUTES.REGISTER} className="w-full">
                        <Button className="w-full">Get started</Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
