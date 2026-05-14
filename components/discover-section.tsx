'use client';

import { Search, Loader2, AlertCircle } from 'lucide-react';
import { MentorCard } from './mentor-card';
import { useState } from 'react';
import Link from 'next/link';
import { useTutorsQuery } from '@/features/tutors/hooks/use-tutors-query';
import { useSubjectsQuery } from '@/features/tutors/hooks/use-subjects-query';
import { TutorFilters } from '@/features/tutors/types';

export function DiscoverSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');

  const { data: subjects = [], isLoading: isSubjectsLoading } = useSubjectsQuery();
  const categories = isSubjectsLoading
    ? [{ id: 'all', name: 'All' }]
    : [{ id: 'all', name: 'All' }, ...subjects];

  const filters: TutorFilters = {
    keyword: searchTerm || undefined,
    subjectId: selectedSubjectId === 'all' ? undefined : selectedSubjectId,
    sortBy: 'recommended',
    limit: 4,
  };

  const { data: tutors = [], isLoading: isTutorsLoading, isError, refetch } = useTutorsQuery(filters);

  return (
    <section id="discover" className="py-16 bg-background scroll-mt-20">
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
              key={category.id}
              onClick={() => setSelectedSubjectId(category.id)}
              className={`text-sm px-4 py-2 rounded-full transition-all font-medium ${selectedSubjectId === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-border'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Mentors Content */}
        {isTutorsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Finding mentors...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 rounded-3xl bg-rose-50 border border-rose-100 text-center gap-4">
            <AlertCircle className="h-10 w-10 text-rose-600" />
            <div className="space-y-1">
              <h3 className="font-bold text-rose-900">Unable to load mentors</h3>
              <p className="text-sm text-rose-700">Something went wrong while connecting to our server.</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold text-sm hover:bg-rose-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-border/60">
            <h3 className="text-lg font-bold text-secondary mb-2">No mentors found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">Try adjusting your filters or search keywords to find more experts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {tutors.map(tutor => (
              <MentorCard
                key={tutor.id}
                name={tutor.fullName}
                title={`${tutor.yearsOfExperience}+ years of experience`}
                expertise={tutor.subjects}
                rating={tutor.averageRating}
                reviews={tutor.reviewCount}
                bio={tutor.bio || tutor.experienceText}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/discover"
            className="inline-block px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all font-medium"
          >
            View All Mentors
          </Link>
        </div>
      </div>
    </section>
  );
}
