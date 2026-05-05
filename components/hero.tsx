'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

export function Hero() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Find Your Perfect Mentor
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Connect with experienced professionals who can accelerate your growth. Get personalized guidance, strategic advice, and meaningful relationships.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 pt-4">
              <label className="text-sm font-medium text-foreground">Search mentors by expertise</label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g., Product Management, Data Science..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-muted-foreground">Popular:</span>
              {['Leadership', 'Startups', 'Tech', 'Business'].map(tag => (
                <button
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
