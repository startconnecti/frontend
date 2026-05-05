import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Logo + Text */}
        <div className="flex items-center gap-3">
          <Image
            src="/connecti-logo-mark.svg"
            alt="Connecti"
            width={36}
            height={36}
            className="h-9 w-auto"
          />
          <span className="text-xl font-bold" style={{ color: '#2C1208' }}>
            Connecti
          </span>
        </div>
        <button className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
          Find a Mentor
        </button>
      </div>
    </nav>
  );
}
