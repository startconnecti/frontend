import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-center">
        <Link href={ROUTES.HOME} className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <Image src="/connecti-logo-mark.svg" alt="Connecti" width={44} height={44} />
          <span className="text-3xl font-bold tracking-tight" style={{ color: '#2C1208' }}>
            Connecti
          </span>
        </Link>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Connecti. All rights reserved.</p>
      </div>
    </div>
  );
}
