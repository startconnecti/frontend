import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-6">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-0 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-sm focus:ring-0 sm:text-sm bg-transparent"
            placeholder="Search..."
            type="search"
          />
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-6 w-px bg-border lg:block" />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="hidden lg:block text-sm font-semibold">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
