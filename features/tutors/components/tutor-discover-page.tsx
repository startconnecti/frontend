'use client';

import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { 
  PageContainer, 
  SectionHeader, 
  ListState 
} from '@/components/shared';
import { TutorCard } from '@/components/client/tutor-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { useTutorFilters } from '../hooks/use-tutor-filters';
import { useTutorsQuery } from '../hooks/use-tutors-query';
import { TutorFilterPanel } from './tutor-filter-panel';
import { TutorSortSelect } from './tutor-sort-select';
import { TutorResultsSummary } from './tutor-results-summary';

export function TutorDiscoverPage() {
  const { filters, updateFilter, resetFilters } = useTutorFilters();
  const { data: tutors = [], isLoading, error, refetch } = useTutorsQuery(filters);

  return (
    <PageContainer className="py-8">
      {/* Hero Section */}
      <div className="mb-12 space-y-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4" style={{ color: '#2C1208' }}>
            Find your perfect tutor
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with expert mentors from around the world to accelerate your learning journey.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name, subject, or keyword..." 
            className="pl-12 h-14 text-base rounded-2xl border-2 focus-visible:ring-primary shadow-sm"
            value={filters.keyword || ''}
            onChange={(e) => updateFilter('keyword', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <TutorFilterPanel 
              filters={filters} 
              updateFilter={updateFilter} 
              resetFilters={resetFilters} 
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b">
            <TutorResultsSummary count={tutors.length} isLoading={isLoading} />
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-2 flex-1 sm:flex-initial">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <TutorFilterPanel 
                    filters={filters} 
                    updateFilter={updateFilter} 
                    resetFilters={resetFilters} 
                  />
                </SheetContent>
              </Sheet>

              <TutorSortSelect 
                value={filters.sortBy} 
                onChange={(val) => updateFilter('sortBy', val)} 
              />
            </div>
          </div>

          {/* Results Grid */}
          <ListState 
            isLoading={isLoading} 
            error={error as Error} 
            isEmpty={tutors.length === 0}
            emptyTitle="No tutors found"
            emptyDescription="Try adjusting your filters or search terms to find more results."
            onRetry={() => refetch()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <TutorCard 
                  key={tutor.id}
                  id={tutor.id}
                  name={tutor.fullName}
                  title={tutor.subjects[0] + ' Expert'}
                  expertise={tutor.subjects}
                  rating={tutor.averageRating}
                  reviews={tutor.reviewCount}
                  hourlyRate={tutor.hourlyRate}
                  bio={tutor.bio}
                  avatar={tutor.avatarUrl}
                />
              ))}
            </div>
          </ListState>
        </div>
      </div>
    </PageContainer>
  );
}
