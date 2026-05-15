'use client';

import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { TutorCard } from '@/components/client/tutor-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTutorFilters } from '../hooks/use-tutor-filters';
import { useTutorListQuery } from '../hooks/use-tutor-list-query';
import { StudentTutorFilterForm } from './student-tutor-filter-form';
import { TutorSortSelect } from './tutor-sort-select';
import { TutorResultsSummary } from './tutor-results-summary';

export function StudentTutorListPage() {
  const { filters, updateFilter, resetFilters } = useTutorFilters();
  const { data, isLoading, error, refetch } = useTutorListQuery(filters);
  const tutors = data?.items ?? [];
  const limit = data?.limit ?? filters.limit ?? 10;
  const offset = data?.offset ?? filters.offset ?? 0;
  const total = data?.total ?? tutors.length;
  const canGoPrevious = offset > 0;
  const canGoNext = offset + limit < total;

  return (
    <PageContainer className="py-0 space-y-8">
      <SectionHeader 
        title="Find Tutors"
        description="Search, filter, and book tutors that match your learning goals."
      />

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <StudentTutorFilterForm
            filters={filters} 
            updateFilter={updateFilter} 
            resetFilters={resetFilters} 
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b">
          <TutorResultsSummary count={total} isLoading={isLoading} />
          <TutorSortSelect 
            value={filters.sortedBy} 
            onChange={(val) => updateFilter('sortedBy', val)} 
          />
        </div>

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
                title={`${tutor.subjects[0] ?? 'Tutor'} Expert`}
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

        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            disabled={!canGoPrevious}
            onClick={() => updateFilter('offset', Math.max(0, offset - limit))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={!canGoNext}
            onClick={() => updateFilter('offset', offset + limit)}
          >
            Next
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
