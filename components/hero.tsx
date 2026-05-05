'use client';

import { ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function CountUpNumber({ end, duration = 1500, format = (n: number) => n.toString() }: { end: number; duration?: number; format?: (n: number) => string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const startTime = Date.now();
          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentCount = Math.floor(progress * end);
            setCount(currentCount);

            if (progress >= 1) {
              setCount(end);
              clearInterval(interval);
            }
          }, 16);

          return () => clearInterval(interval);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return <div ref={ref}>{format(count)}</div>;
}

export function Hero() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col gap-8">
          {/* Headline */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight" style={{ color: '#2C1208' }}>
                Stop guessing.
              </h1>
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight" style={{ color: '#E8341A' }}>
                Start connecting.
              </h1>
            </div>
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
              <div className="text-3xl font-bold text-secondary">
                <CountUpNumber end={500} format={(n) => n === 500 ? '500+' : n.toString()} />
              </div>
              <div className="text-sm text-muted-foreground">Expert Mentors</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-3xl font-bold text-secondary">
                <CountUpNumber end={92} format={(n) => n === 92 ? '92%' : (n > 0 ? n + '%' : '0%')} />
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-3xl font-bold text-secondary">
                <CountUpNumber end={15} duration={1500} format={(n) => n === 15 ? '15K+' : (n > 0 ? n + 'K+' : '0K+')} />
              </div>
              <div className="text-sm text-muted-foreground">Sessions Booked</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
