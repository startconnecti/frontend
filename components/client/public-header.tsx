'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ROUTES } from '@/constants/routes';

const navLinks = [
  { label: 'Find Tutors', href: ROUTES.DISCOVER },
  { label: 'How It Works', href: ROUTES.HOW_IT_WORKS },
  { label: 'Become a Tutor', href: ROUTES.BECOME_A_TUTOR },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo Area */}
        <div className="flex items-center gap-8">
          <Link href={ROUTES.HOME} className="flex items-center gap-3 shrink-0">
            <Image src="/connecti-logo-mark.svg" alt="Connecti" width={32} height={32} />
            <span className="text-xl font-bold tracking-tight" style={{ color: '#2C1208' }}>Connecti</span>
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
          <Link href={ROUTES.LOGIN}>
            <Button variant="ghost" size="sm" className="font-medium">Log in</Button>
          </Link>
          <Link href={ROUTES.REGISTER}>
            <Button size="sm" className="font-medium bg-primary text-primary-foreground hover:opacity-90">
              Get started
            </Button>
          </Link>
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
            <SheetContent side="right" className="w-full sm:max-w-xs">
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
                <div className="flex flex-col gap-3 pt-4">
                  <Link href={ROUTES.LOGIN} className="w-full">
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href={ROUTES.REGISTER} className="w-full">
                    <Button className="w-full">Get started</Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
