import { Star, MessageCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface TutorCardProps {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  rating: number;
  reviews: number;
  hourlyRate: number;
  bio: string;
  avatar?: string;
  href?: string;
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
  href = `/tutors/${id}` 
}: TutorCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow group border-border/60">
      <CardHeader className="flex-row gap-4 space-y-0 p-6">
        <Avatar className="h-16 w-16 border-2 border-primary/10">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="text-lg bg-primary/5 text-primary">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg leading-none">{name}</h3>
            <p className="font-bold text-primary">${hourlyRate}<span className="text-xs text-muted-foreground font-normal">/hr</span></p>
          </div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 px-6 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{bio}</p>
        <div className="flex flex-wrap gap-1.5">
          {expertise.slice(0, 3).map(skill => (
            <Badge key={skill} variant="secondary" className="text-[10px] font-medium px-2 py-0">
              {skill}
            </Badge>
          ))}
          {expertise.length > 3 && (
            <span className="text-[10px] text-muted-foreground ml-1">+{expertise.length - 3} more</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
            <Link href={href}>
              View Profile
            </Link>
          </Button>
          <Button size="sm" className="flex-1 gap-2">
            <MessageCircle className="h-4 w-4" />
            Connect
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
