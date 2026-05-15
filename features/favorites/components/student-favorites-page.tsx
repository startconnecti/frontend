'use client';

import { Heart, Search, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';

import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { TutorCard } from '@/components/client/tutor-card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useFavoriteTutorsQuery } from '../hooks/use-favorite-tutors-query';
import { useRemoveFavoriteTutorMutation } from '../hooks/use-remove-favorite-tutor-mutation';

export function StudentFavoritesPage() {
  const { data, isLoading, isError, error, refetch } = useFavoriteTutorsQuery();
  const favorites = data?.items || [];
  const removeMutation = useRemoveFavoriteTutorMutation();

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
          {favorites.map((fav) => (
            <div key={fav.favoriteId} className="relative group">
              <TutorCard
                id={fav.tutor.id}
                name={fav.tutor.fullName}
                title={`${fav.tutor.yearsOfExperience}+ Years Experience`}
                expertise={fav.tutor.subjects}
                rating={fav.tutor.averageRating}
                reviews={fav.tutor.reviewCount}
                hourlyRate={fav.tutor.hourlyRate}
                bio={fav.tutor.bio}
                avatar={fav.tutor.avatarUrl}
              />
              
              <div className="mt-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                  <Calendar className="h-3 w-3" />
                  Favorited {new Date(fav.createdAt).toLocaleDateString()}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-2 font-bold text-xs"
                  onClick={() => handleRemove(fav.favoriteId)}
                  disabled={removeMutation.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ListState>
    </PageContainer>
  );
}
