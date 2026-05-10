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
    <div className="border border-border/60 rounded-3xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:border-primary/20 bg-background group flex flex-col h-full">
      <div className="flex gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex-shrink-0 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary/10 transition-colors">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-foreground text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{title}</p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed flex-1">{bio}</p>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {expertise.slice(0, 3).map(exp => (
          <span key={exp} className="text-[10px] px-2.5 py-1 rounded-full bg-primary/5 text-primary font-bold uppercase tracking-wider border border-primary/5">
            {exp}
          </span>
        ))}
        {expertise.length > 3 && (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-bold border border-transparent">
            +{expertise.length - 3}
          </span>
        )}
      </div>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all font-bold text-sm">
        <MessageCircle className="w-4 h-4" />
        Connect
      </button>
    </div>
  );
}
