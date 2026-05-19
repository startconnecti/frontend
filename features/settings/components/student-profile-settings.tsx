'use client';

import { useState, useEffect } from 'react';
import { useSubjectsQuery } from '@/features/tutors/hooks/use-subjects-query';
import { useStudentProfileQuery } from '../hooks/use-student-profile-query';
import { useUpdateStudentProfileMutation } from '../hooks/use-update-student-profile-mutation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StudentProfileSettings() {
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjectsQuery();
  const { data: profile, isLoading: isLoadingProfile } = useStudentProfileQuery();
  const updateMutation = useUpdateStudentProfileMutation();

  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  useEffect(() => {
    if (profile?.subjectIds) {
      setSelectedSubjectIds(profile.subjectIds);
    }
  }, [profile]);

  const handleToggleSubject = (subjectId: string) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSave = () => {
    updateMutation.mutate(selectedSubjectIds);
  };

  const isLoading = isLoadingSubjects || isLoadingProfile;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Find if there are any changes compared to the initial profile data
  const hasChanges =
    !profile ||
    selectedSubjectIds.length !== profile.subjectIds.length ||
    selectedSubjectIds.some((id) => !profile.subjectIds.includes(id));

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h4 className="text-lg font-bold text-brand-dark flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Student Profile Settings
        </h4>
        <p className="text-sm text-muted-foreground">
          Select your favorite subjects to help us personalize your learning experience.
        </p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Available Subjects
            </span>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {selectedSubjectIds.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {subjects?.map((subject) => {
              const isSelected = selectedSubjectIds.includes(subject.id);
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => handleToggleSubject(subject.id)}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-xl border text-sm font-bold text-left transition-all select-none hover:shadow-sm",
                    isSelected
                      ? "bg-primary/5 border-primary text-primary"
                      : "bg-background border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="truncate pr-2">{subject.name}</span>
                  {isSelected && (
                    <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="h-2.5 w-2.5 text-primary-foreground stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-border/60">
            <Button
              onClick={handleSave}
              className="font-bold px-8 rounded-xl shadow-lg shadow-primary/10"
              disabled={updateMutation.isPending || !hasChanges}
            >
              {updateMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
