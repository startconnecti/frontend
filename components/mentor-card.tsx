import { Star, MessageCircle } from 'lucide-react';

interface MentorCardProps {
  name: string;
  title: string;
  expertise: string[];
  rating: number;
  reviews: number;
  bio: string;
  image?: string;
}

export function MentorCard({ name, title, expertise, rating, reviews, bio }: MentorCardProps) {
  return (
    <div className="border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-primary bg-card">
      <div className="flex gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0"></div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bio}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {expertise.slice(0, 3).map(exp => (
          <span key={exp} className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground">
            {exp}
          </span>
        ))}
        {expertise.length > 3 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground">
            +{expertise.length - 3}
          </span>
        )}
      </div>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium text-sm">
        <MessageCircle className="w-4 h-4" />
        Connect
      </button>
    </div>
  );
}
