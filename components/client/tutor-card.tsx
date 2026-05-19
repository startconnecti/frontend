import { Star, MessageCircle, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useToggleFavorite } from '@/features/tutors/hooks/use-toggle-favorite';
import { useRouter } from 'next/navigation';

interface TutorCardProps {
  id?: string;
  name?: string;
  title?: string;
  expertise?: string[];
  rating?: number;
  reviews?: number;
  hourlyRate?: number;
  bio?: string;
  avatar?: string;
  href?: string;
  isFavorite?: boolean;
  
  tutor?: {
    tutorId: string;
    fullName: string;
    avatarUrl?: string | null;
    bio: string;
    hourlyRate: number;
    rating: number;
    subjects: Array<{ id: string; name: string } | string>;
    isFavorite: boolean;
  };
}

export function TutorCard({
  id,
  name,
  title,
  expertise,
  rating,
  reviews,
  hourlyRate,
  bio,
  avatar,
  href,
  isFavorite = false,
  tutor
}: TutorCardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  console.log("Data inside Card:", tutor);
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const isStudent = isAuthenticated && user?.role === 'student';

  const actualId = tutor?.tutorId ?? id ?? '';
  const actualName = tutor?.fullName ?? name ?? '';
  const actualAvatar = tutor?.avatarUrl ?? avatar ?? undefined;
  const actualBio = tutor?.bio ?? bio ?? '';
  const actualHourlyRate = tutor?.hourlyRate ?? hourlyRate ?? 0;
  const actualRating = tutor?.rating ?? rating ?? 0;
  const actualIsFavorite = tutor?.isFavorite ?? isFavorite ?? false;
  
  const actualSubjects = tutor?.subjects?.map(s => typeof s === 'string' ? s : s.name) ?? expertise ?? [];
  const actualTitle = title ?? `${actualSubjects[0] ?? 'Tutor'} Expert`;
  const actualHref = href ?? `/tutors/${actualId}`;

  return (
    <Card className="flex flex-col h-full hover:shadow-xl hover:shadow-primary/5 transition-all group border-border/60 rounded-3xl overflow-hidden">
      <CardHeader className="p-6">
        {/* Row 1 (Header) */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/10">
              <AvatarImage src={actualAvatar} alt={actualName} />
              <AvatarFallback className="text-sm bg-primary/5 text-primary font-bold">
                {actualName ? actualName.charAt(0) : 'T'}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-base leading-none text-brand-dark">{actualName}</h3>
          </div>
          
          {isStudent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleFavorite({ tutorId: actualId, isFavorite: actualIsFavorite });
              }}
              disabled={isPending}
              className={`transition-transform hover:scale-110 active:scale-95 focus:outline-none ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={actualIsFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-5 w-5 ${actualIsFavorite ? 'text-red-500 fill-red-500' : 'text-red-500 fill-none'}`} />
            </button>
          )}
        </div>

        {/* Row 2 (Title) */}
        <p className="text-sm text-gray-600 line-clamp-2 mt-2">{actualTitle}</p>

        {/* Row 3 (Price & Rating) */}
        <div className="flex justify-between items-center mt-3">
          <p className="font-bold text-primary">
            {actualHourlyRate.toLocaleString('vi-VN')} đ/h
          </p>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{actualRating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{actualBio}</p>
        <div className="flex flex-wrap gap-1.5">
          {actualSubjects.slice(0, 3).map(skill => (
            <Badge key={skill} variant="secondary" className="text-[10px] font-medium px-2 py-0">
              {skill}
            </Badge>
          ))}
          {actualSubjects.length > 3 && (
            <span className="text-[10px] text-muted-foreground ml-1">+{actualSubjects.length - 3} more</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
            <Link href={actualHref}>
              View Profile
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.push(`/student/messages?tutorId=${actualId}`);
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Connect
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
