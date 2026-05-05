'use client';

import { Search } from 'lucide-react';
import { MentorCard } from './mentor-card';
import { useState } from 'react';

const mentorsData = [
  {
    name: 'Sarah Chen',
    title: 'Harvard MBA, Stanford GSB',
    expertise: ['MBA Admissions', 'Career Coaching', 'Leadership'],
    rating: 4.9,
    reviews: 87,
    bio: 'Helped 50+ students gain admission to top MBA programs. Expert in application strategy.',
  },
  {
    name: 'Marcus Johnson',
    title: 'Fulbright Scholar, Oxford',
    expertise: ['Scholarships', 'Academic Excellence', 'Career Path'],
    rating: 4.8,
    reviews: 62,
    bio: 'Fulbright scholarship recipient. Mentors students on scholarship strategy and planning.',
  },
  {
    name: 'Elena Rodriguez',
    title: 'GMAT Expert, Test Prep Coach',
    expertise: ['GMAT', 'GRE', 'Test Strategy'],
    rating: 5.0,
    reviews: 54,
    bio: 'Specialized in standardized test prep. Average student score improvement: 120 points.',
  },
  {
    name: 'James Park',
    title: 'IELTS Specialist, Language Coach',
    expertise: ['IELTS', 'Language Learning', 'Communication'],
    rating: 4.7,
    reviews: 43,
    bio: 'Expert English language coach. Specializes in IELTS and academic writing.',
  },
];

const categories = ['All', 'Scholarships', 'MBA Admissions', 'Career Coaching', 'GMAT', 'GRE', 'IELTS', 'SAT'];

export function DiscoverSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Discover
          </div>
          <h2 className="text-4xl font-bold text-secondary mb-3">
            Find your perfect mentor
          </h2>
          <p className="text-base text-muted-foreground">
            Filter by your goals and get matched with verified experts
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by expertise, name, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm px-4 py-2 rounded-full transition-all font-medium ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-border'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {mentorsData.map(mentor => (
            <MentorCard key={mentor.name} {...mentor} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all font-medium">
            View All Mentors
          </button>
        </div>
      </div>
    </section>
  );
}
