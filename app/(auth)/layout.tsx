import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 flex justify-center">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/connecti-logo-mark.svg" alt="Connecti" width={40} height={40} />
          <span className="text-2xl font-bold" style={{ color: '#2C1208' }}>
            Connecti
          </span>
        </Link>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
