import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Image
          src="/logo-icon.svg"
          alt="Connecti"
          width={40}
          height={40}
          className="h-10 w-auto"
        />
        <button className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
          Find a Mentor
        </button>
      </div>
    </nav>
  );
}
