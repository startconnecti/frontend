'use client';

import { Heart, Search, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { TutorCard } from '@/components/client/tutor-card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useFavoriteTutorsQuery } from '../hooks/use-favorite-tutors-query';
import { useRemoveFavoriteTutorMutation } from '../hooks/use-remove-favorite-tutor-mutation';
import { Pagination } from '@/components/shared/pagination';

export function StudentFavoritesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;

  const { data, isLoading, isError, error, refetch } = useFavoriteTutorsQuery(page, limit);
  const favorites = data?.items || [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  console.log("Data in Parent:", favorites);
  const removeMutation = useRemoveFavoriteTutorMutation();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRemove = (favoriteId: string) => {
    if (window.confirm('Are you sure you want to remove this tutor from your favorites?')) {
      removeMutation.mutate(favoriteId);
    }
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader
          title="My Favorite Tutors"
          description="Keep track of the mentors you love and book sessions easily."
        />
        <Button className="font-bold gap-2" asChild>
          <Link href={ROUTES.DISCOVER}>
            <Search className="h-4 w-4" />
            Discover More Tutors
          </Link>
        </Button>
      </div>

      <ListState
        isLoading={isLoading}
        error={error as Error}
        isEmpty={favorites.length === 0}
        emptyTitle="No favorite tutors yet"
        emptyDescription="Start exploring the marketplace and heart the tutors you'd like to work with."
        onRetry={() => refetch()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((fav) => {
            const tutorData = {
              tutorId: fav.tutorId,
              fullName: fav.fullName,
              avatarUrl: fav.avatarUrl,
              bio: fav.bio,
              hourlyRate: fav.hourlyRate,
              rating: fav.ratingAvg || 0,
              subjects: fav.subjects || [],
              isFavorite: fav.isFavorite ?? true
            };

            return (
              <div key={fav.favoriteId} className="relative group">
                <TutorCard key={tutorData.tutorId} tutor={tutorData} />
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </ListState>
    </PageContainer>
  );
}
