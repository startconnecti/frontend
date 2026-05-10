'use client';

interface TutorProfileAboutProps {
  bio: string;
}

export function TutorProfileAbout({ bio }: TutorProfileAboutProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight" style={{ color: '#2C1208' }}>About Me</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
        {bio.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
