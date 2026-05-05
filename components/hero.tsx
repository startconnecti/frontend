'use client';

import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col gap-8">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight text-secondary">
              Stop guessing.{' '}
              <span className="text-primary">Start connecting.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed pt-2">
              Get matched with Fulbright scholars, Harvard MBAs, and industry leaders who&apos;ve walked the path you&apos;re on — for scholarships, MBA admissions, and career breakthroughs.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium text-base">
              Find a Mentor
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 rounded-lg border border-foreground text-foreground hover:bg-muted transition-colors font-medium text-base">
              How It Works
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-8"></div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
            <div className="flex flex-col gap-1">
              <div className="text-3xl font-bold text-secondary">500+</div>
              <div className="text-sm text-muted-foreground">Expert Mentors</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-3xl font-bold text-secondary">92%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-3xl font-bold text-secondary">15K+</div>
              <div className="text-sm text-muted-foreground">Sessions Booked</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
