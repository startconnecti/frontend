'use client';

import { useRouter } from 'next/navigation';
import { Bell, LogOut, Search } from 'lucide-react';
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
import { Input } from '@/components/ui/input';

interface AdminHeaderProps {
  onSearch?: (query: string) => void;
}

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

export function AdminHeader({ onSearch }: AdminHeaderProps) {
  const router = useRouter();
  const admin = useAdminAuthStore((state) => state.admin);
  const logout = useAdminAuthStore((state) => state.logout);

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
    <div className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="hidden flex-1 md:flex">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10"
              onChange={(event) => onSearch?.(event.target.value)}
            />
          </div>
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
                className="text-destructive focus:text-destructive"
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