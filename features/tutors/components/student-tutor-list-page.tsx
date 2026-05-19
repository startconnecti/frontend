'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { TutorCard } from '@/components/client/tutor-card';
import { Card, CardContent } from '@/components/ui/card';
import { useGetTutors } from '../hooks/use-get-tutors';
import { StudentTutorFilterForm } from './student-tutor-filter-form';
import { TutorSortSelect } from './tutor-sort-select';
import { TutorResultsSummary } from './tutor-results-summary';
import { Pagination } from '@/components/shared/pagination';

export function StudentTutorListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = searchParams.get('page') || '1';
  const limit = 10;
  const offset = (Number(page) - 1) * limit;

  const filters = {
    limit,
    offset,
    page: Number(page),
    keyword: searchParams.get('keyword') || '',
    subjectId: searchParams.get('subjectId') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    availabilityDay: searchParams.get('availabilityDay') || undefined,
    sortedBy: (searchParams.get('sortedBy') as any) || 'rate_high',
  };

  const { data, isLoading, error, refetch } = useGetTutors(filters);
  const tutors = data?.items ?? [];
  const total = data?.total ?? 0;

  const updateFilter = (key: string, value: any) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
    // Reset page to 1 on filter change
    if (key !== 'page') {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  const handlePageChange = (newPage: number) => {
    updateFilter('page', newPage);
  };

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
                isFavorite={tutor.isFavorite}
              />
            ))}
          </div>
          
          <Pagination 
            currentPage={Number(page)} 
            totalPages={Math.ceil(total / limit)} 
            onPageChange={handlePageChange} 
          />
        </ListState>
      </div>
    </PageContainer>
  );
}
