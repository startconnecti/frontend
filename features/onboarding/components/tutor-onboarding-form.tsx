'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, User, GraduationCap, DollarSign, Award, Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { TutorProfileSetupRequest } from '@/features/auth/types';
import { ONBOARDING_CONSTANTS } from '../constants';

import { TutorOnboardingStepper } from './tutor-onboarding-stepper';
import { useAuthStore } from '@/stores/auth-store';
import { useSubmitTutorOnboardingMutation } from '../hooks/use-submit-tutor-onboarding-mutation';
import { toast } from 'sonner';

import { TutorTeachingProfileStep } from './tutor-teaching-profile-step';
import { TutorSubjectsRateStep } from './tutor-subjects-rate-step';
import { TutorCertificatesStep } from './tutor-certificates-step';
import { TutorAvailabilityStep } from './tutor-availability-step';
import { TutorReviewSubmitStep } from './tutor-review-submit-step';
import { validateWeeklyAvailability } from '../utils/validate-weekly-availability';

const STEPS = [
  { title: 'Profile', icon: GraduationCap },
  { title: 'Rate', icon: DollarSign },
  { title: 'Certificates', icon: Award },
  { title: 'Schedule', icon: Calendar },
  { title: 'Review', icon: ShieldCheck },
];

const ONBOARDING_DRAFT_VERSION = 1;
const ONBOARDING_DRAFT_MAX_AGE_DAYS = 7;

interface TutorOnboardingDraft {
  version: number;
  savedAt: string;
  currentStep: number;
  formData: TutorProfileSetupRequest;
}

export function TutorOnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftState, setDraftState] = useState<'loading' | 'prompt' | 'ready'>('loading');
  const [pendingDraft, setPendingDraft] = useState<TutorOnboardingDraft | null>(null);
  const submitOnboarding = useSubmitTutorOnboardingMutation();
  const isPending = submitOnboarding.isPending;
  const TUTOR_ONBOARDING_DRAFT_KEY = 'tutor-onboarding-draft';
  const { user, updateUser, logout } = useAuthStore();
  const isTutorReady = user?.role === 'tutor' && user.onboardingCompleted === true;
  
  const [formData, setFormData] = useState<TutorProfileSetupRequest>({
    bio: '',
    experienceText: '',
    yearsOfExperience: 0,
    hourlyRate: 200000,
    subjects: [],
    certificates: [],
    weeklyAvailability: [],
    requestNote: '',
  });

  const updateFormData = (newData: Partial<TutorProfileSetupRequest>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    // Clear errors for fields being updated
    if (errors) {
      const newErrors = { ...errors };
      Object.keys(newData).forEach(key => delete newErrors[key]);
      setErrors(newErrors);
    }
  };

  // Restore Draft
  useEffect(() => {
    try {
      if (user?.onboardingCompleted) {
        localStorage.removeItem(TUTOR_ONBOARDING_DRAFT_KEY);
        setDraftState('ready');
        return;
      }

      const saved = localStorage.getItem(TUTOR_ONBOARDING_DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as TutorOnboardingDraft;
        
        // Validate Version
        if (draft.version !== ONBOARDING_DRAFT_VERSION) {
          localStorage.removeItem(TUTOR_ONBOARDING_DRAFT_KEY);
          setDraftState('ready');
          return;
        }

        // Validate TTL
        const savedDate = new Date(draft.savedAt);
        const ageInMs = Date.now() - savedDate.getTime();
        const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
        if (ageInDays > ONBOARDING_DRAFT_MAX_AGE_DAYS) {
          localStorage.removeItem(TUTOR_ONBOARDING_DRAFT_KEY);
          setDraftState('ready');
          return;
        }

        // Valid draft found
        
        // Migration: If draft subjects are strings (old format), clear them so they can be re-selected
        if (draft.formData.subjects && draft.formData.subjects.length > 0 && typeof draft.formData.subjects[0] === 'string') {
          draft.formData.subjects = [];
        }

        setPendingDraft(draft);
        setDraftState('prompt');
        return;
      }
      
      setDraftState('ready');
    } catch (err) {
      console.error('Failed to restore onboarding draft', err);
      setDraftState('ready');
    }
  }, [user]);

  const handleContinueDraft = () => {
    if (pendingDraft) {
      if (pendingDraft.formData) setFormData(pendingDraft.formData);
      if (typeof pendingDraft.currentStep === 'number') setCurrentStep(pendingDraft.currentStep);
    }
    setDraftState('ready');
    setPendingDraft(null);
  };

  const handleStartOver = () => {
    localStorage.removeItem(TUTOR_ONBOARDING_DRAFT_KEY);
    setDraftState('ready');
    setPendingDraft(null);
  };

  // Save Draft (Debounced)
  useEffect(() => {
    if (draftState !== 'ready') return;

    const handler = setTimeout(() => {
      const safeFormData = {
        ...formData,
        certificates: formData.certificates.map(({ file, ...rest }) => rest), // Strip File objects
      };
      
      const draft: TutorOnboardingDraft = {
        version: ONBOARDING_DRAFT_VERSION,
        savedAt: new Date().toISOString(),
        currentStep,
        formData: safeFormData
      };
      
      localStorage.setItem(TUTOR_ONBOARDING_DRAFT_KEY, JSON.stringify(draft));
    }, 1000);

    return () => clearTimeout(handler);
  }, [formData, currentStep, draftState]);

  const clearDraft = () => {
    localStorage.removeItem(TUTOR_ONBOARDING_DRAFT_KEY);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (formData.bio.length < ONBOARDING_CONSTANTS.BIO_MIN_LENGTH) {
        newErrors.bio = `Bio must be at least ${ONBOARDING_CONSTANTS.BIO_MIN_LENGTH} characters`;
      }
      if (formData.yearsOfExperience < 0) newErrors.yearsOfExperience = 'Years of experience must be 0 or greater.';
    }

    if (step === 1) {
      if (formData.subjects.length === 0) newErrors.subjects = 'Please select at least one subject';
      if (formData.hourlyRate <= 0) newErrors.hourlyRate = 'Hourly rate must be greater than 0';
    }

    if (step === 2) {
      formData.certificates.forEach((cert, i) => {
        if (!cert.title.trim()) newErrors[`cert_${i}_title`] = 'Title is required';
      });
    }

    if (step === 3) {
      formData.weeklyAvailability.forEach((avail, i) => {
        if (avail.startTime >= avail.endTime) {
          newErrors[`avail_${i}`] = 'Start time must be before end time';
        }
      });
      
      const overlapResult = validateWeeklyAvailability(formData.weeklyAvailability);
      if (!overlapResult.valid) {
        overlapResult.overlappingIndexes.forEach(index => {
          newErrors[`overlap_${index}`] = 'This slot overlaps with another slot';
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 3) {
      const overlapResult = validateWeeklyAvailability(formData.weeklyAvailability);
      if (!overlapResult.valid) {
        toast.error('Some availability slots overlap. Please fix them before continuing.');
        validateStep(currentStep); // Update error state visually
        return;
      }
    }

    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSkipAndExit = () => {
    if (isTutorReady) {
      router.push(ROUTES.TUTOR_DASHBOARD);
    } else {
      updateUser({ onboardingSkipped: true });
      router.push(ROUTES.TUTOR_DASHBOARD);
    }
  };
  const handleSubmit = async () => {
    // Validate all steps before submission
    let isValid = true;
    for (let i = 0; i <= 4; i++) {
      if (!validateStep(i)) {
        isValid = false;
        setCurrentStep(i);
        toast.error('Please fix the errors in this step before submitting.');
        break;
      }
    }

    if (isValid) {
      try {
        const payloadJson = {
          profile: {
            bio: formData.bio,
            experience_text: formData.experienceText,
            years_of_experience: formData.yearsOfExperience,
            hourly_rate: formData.hourlyRate,
          },
          subject_ids: formData.subjects.map(s => s.id),
          certifications: formData.certificates.map(cert => ({
            name: cert.title || 'Untitled',
            issuer: cert.issuer || 'Unknown',
            issuedAt: cert.year.toString(),
            tempFileKey: cert.tempFileKey,
          })),
          weekly_availabilities: formData.weeklyAvailability.map(slot => ({
            day_of_week: slot.dayOfWeek.toLowerCase(),
            start_time: slot.startTime,
            end_time: slot.endTime,
          })),
        };

        const submitData = new FormData();
        submitData.append('payloadJson', JSON.stringify(payloadJson));

        formData.certificates.forEach(cert => {
          if (cert.file && cert.tempFileKey) {
            submitData.append(cert.tempFileKey, cert.file);
          }
        });

        await submitOnboarding.mutateAsync(submitData);

        clearDraft();
        updateUser({ onboardingCompleted: true });
        router.push(ROUTES.TUTOR_DASHBOARD);
      } catch (err) {
        toast.error('Failed to submit application. Please check your data and try again.');
      }
    }
  };

  const isStepInvalid = useMemo(() => {
    // Basic reactive validation for UI state
    if (currentStep === 0) return formData.bio.length < ONBOARDING_CONSTANTS.BIO_MIN_LENGTH;
    if (currentStep === 1) return formData.subjects.length === 0 || formData.hourlyRate <= 0;
    return false;
  }, [currentStep, formData]);



  if (draftState === 'loading') {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Dialog open={draftState === 'prompt'} onOpenChange={() => {}}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Resume your onboarding application?</DialogTitle>
            <DialogDescription>
              We found an unfinished onboarding application saved on this device.<br/><br/>
              Would you like to continue where you left off or start over?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleStartOver}>
              Start Over
            </Button>
            <Button onClick={handleContinueDraft}>
              Continue Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TutorOnboardingStepper steps={STEPS} currentStep={currentStep} />

      <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden min-h-[450px] flex flex-col p-0 gap-0">
        <CardHeader className="bg-primary/5 border-b border-primary/10 p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {(() => {
                const Icon = STEPS[currentStep].icon;
                return <Icon className="h-5 w-5" />;
              })()}
            </div>
            <div>
              <CardTitle className="text-lg">{STEPS[currentStep].title}</CardTitle>
              <CardDescription>Step {currentStep + 1} of {STEPS.length}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 flex-1">
          {currentStep === 0 && <TutorTeachingProfileStep data={formData} onChange={updateFormData} errors={errors} />}
          {currentStep === 1 && <TutorSubjectsRateStep data={formData} onChange={updateFormData} errors={errors} />}
          {currentStep === 2 && <TutorCertificatesStep data={formData} onChange={updateFormData} errors={errors} />}
          {currentStep === 3 && <TutorAvailabilityStep data={formData} onChange={updateFormData} errors={errors} />}
          {currentStep === 4 && <TutorReviewSubmitStep data={formData} onChange={updateFormData} />}
        </CardContent>

        <CardFooter className="border-t bg-muted/10 p-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkipAndExit}>
              {isTutorReady ? 'Go to Dashboard' : 'Skip for now'}
            </Button>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
          </div>

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} className="font-bold" disabled={isStepInvalid}>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="font-bold shadow-lg shadow-primary/20" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
