'use client';

interface TutorProfileAboutProps {
  bio?: string | null;
  experienceText?: string | null;
}

export function TutorProfileAbout({ bio, experienceText }: TutorProfileAboutProps) {
  if (!bio && !experienceText) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight" style={{ color: '#2C1208' }}>About Me</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
        {bio?.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {experienceText && (
        <div className="rounded-2xl border border-border/50 bg-muted/5 p-4">
          <h3 className="text-sm font-bold mb-2" style={{ color: '#2C1208' }}>Experience</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{experienceText}</p>
        </div>
      )}
    </div>
  );
}
