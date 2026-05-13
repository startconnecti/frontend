'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Bell, LogOut, Menu } from 'lucide-react';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { adminApi } from '@/lib/admin-api/client';
import { useAdminAuthStore } from '@/stores/admin-auth-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SidebarContent } from './admin-sidebar';

function getInitials(nameOrEmail?: string | null) {
  if (!nameOrEmail) {
    return 'AD';
  }

  const words = nameOrEmail.trim().split(/\s+/);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return nameOrEmail.slice(0, 2).toUpperCase();
}

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const admin = useAdminAuthStore((state) => state.admin);
  const logout = useAdminAuthStore((state) => state.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const displayName = admin?.fullName || 'Admin User';
  const displayEmail = admin?.email || 'admin@connecti.com';
  const initials = getInitials(admin?.fullName || admin?.email);

  const handleLogout = async () => {
    try {
      await adminApi.post('/api/v1/admin/auth/logout');
    } finally {
      logout();
      router.replace(ADMIN_ROUTES.LOGIN);
    }
  };

  return (
    <div className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle mobile menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Admin Navigation</SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
          {/* We can leave the left side empty as per requirements to replace fake search. 
              The mobile trigger takes its place nicely on small screens. */}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {initials}
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{displayEmail}</p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem disabled>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem disabled>Change Password</DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}