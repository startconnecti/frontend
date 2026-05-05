'use client';

import { MentorCard } from './mentor-card';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const mentorsData = [
  {
    name: 'Sarah Chen',
    title: 'VP Product at TechCorp',
    expertise: ['Product Management', 'Leadership', 'Startups'],
    rating: 4.9,
    reviews: 87,
    bio: 'Led product launches for 5+ companies. Passionate about helping founders build successful products.',
  },
  {
    name: 'Marcus Johnson',
    title: 'Principal Engineer, AI/ML',
    expertise: ['Machine Learning', 'System Design', 'Tech Leadership'],
    rating: 4.8,
    reviews: 62,
    bio: 'Deep experience in building scalable ML systems. Mentored 30+ engineers into senior roles.',
  },
  {
    name: 'Elena Rodriguez',
    title: 'Founder & CEO',
    expertise: ['Entrepreneurship', 'Fundraising', 'Marketing'],
    rating: 5.0,
    reviews: 54,
    bio: 'Built and exited 2 startups. Currently advising early-stage founders on go-to-market strategies.',
  },
  {
    name: 'James Park',
    title: 'Design Director',
    expertise: ['UX/UI Design', 'Design Systems', 'Creative Strategy'],
    rating: 4.7,
    reviews: 43,
    bio: 'Award-winning designer. Specializes in helping teams build user-centered products.',
  },
];

export function MentorSection() {
  const [sortBy, setSortBy] = useState('relevant');
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);

  const expertiseOptions = ['Product Management', 'Leadership', 'Startups', 'Machine Learning', 'Design', 'Fundraising'];

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Featured Mentors</h2>
          
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter by:</span>
              <div className="flex flex-wrap gap-2">
                {expertiseOptions.map(expertise => (
                  <button
                    key={expertise}
                    onClick={() => setSelectedExpertise(selectedExpertise === expertise ? null : expertise)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                      selectedExpertise === expertise
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-border'
                    }`}
                  >
                    {expertise}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-sm hover:bg-muted transition-colors">
                  {sortBy === 'relevant' ? 'Most Relevant' : 'Highest Rated'}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {mentorsData.map(mentor => (
            <MentorCard key={mentor.name} {...mentor} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all font-medium">
            View All Mentors
          </button>
        </div>
      </div>
    </section>
  );
}
