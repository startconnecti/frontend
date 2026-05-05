export function Navbar() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-foreground">
          Connecti
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">
            Explore
          </a>
          <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">
            For Mentors
          </a>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
