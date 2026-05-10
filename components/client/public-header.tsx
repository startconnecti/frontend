import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/connecti-logo-mark.svg" alt="Connecti" width={32} height={32} />
            <span className="text-xl font-bold" style={{ color: '#2C1208' }}>Connecti</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/discover" className="text-sm font-medium hover:text-primary transition-colors">Find a Mentor</Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">How it works</Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
