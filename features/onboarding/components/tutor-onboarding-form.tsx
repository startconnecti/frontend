'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, User, GraduationCap, DollarSign, Award, Calendar, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { TutorOnboardingRequest } from '../types';
import { ONBOARDING_CONSTANTS } from '../constants';
import { TutorOnboardingStepper } from './tutor-onboarding-stepper';
import { useCompleteTutorOnboardingMutation } from '../hooks/use-complete-tutor-onboarding-mutation';

import { TutorPersonalStep } from './tutor-personal-step';
import { TutorTeachingProfileStep } from './tutor-teaching-profile-step';
import { TutorSubjectsRateStep } from './tutor-subjects-rate-step';
import { TutorCertificatesStep } from './tutor-certificates-step';
import { TutorAvailabilityStep } from './tutor-availability-step';
import { TutorReviewSubmitStep } from './tutor-review-submit-step';

const STEPS = [
  { title: 'Personal', icon: User },
  { title: 'Profile', icon: GraduationCap },
  { title: 'Rate', icon: DollarSign },
  { title: 'Certificates', icon: Award },
  { title: 'Schedule', icon: Calendar },
  { title: 'Review', icon: ShieldCheck },
];

export function TutorOnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const onboardingMutation = useCompleteTutorOnboardingMutation();
  
  const [formData, setFormData] = useState<TutorOnboardingRequest>({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'undisclosed',
    bio: '',
    experienceText: '',
    yearsOfExperience: 0,
    hourlyRate: 25,
    subjects: [],
    certificates: [],
    weeklyAvailability: [],
    requestNote: '',
  });

  const updateFormData = (newData: Partial<TutorOnboardingRequest>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    // Clear errors for fields being updated
    if (errors) {
      const newErrors = { ...errors };
      Object.keys(newData).forEach(key => delete newErrors[key]);
      setErrors(newErrors);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    }

    if (step === 1) {
      if (formData.bio.length < ONBOARDING_CONSTANTS.BIO_MIN_LENGTH) {
        newErrors.bio = `Bio must be at least ${ONBOARDING_CONSTANTS.BIO_MIN_LENGTH} characters`;
      }
      if (formData.yearsOfExperience < 0) newErrors.yearsOfExperience = 'Years of experience cannot be negative';
    }

    if (step === 2) {
      if (formData.subjects.length === 0) newErrors.subjects = 'Please select at least one subject';
      if (formData.hourlyRate <= 0) newErrors.hourlyRate = 'Hourly rate must be greater than 0';
    }

    if (step === 3) {
      formData.certificates.forEach((cert, i) => {
        if (!cert.title.trim()) newErrors[`cert_${i}_title`] = 'Title is required';
      });
    }

    if (step === 4) {
      formData.weeklyAvailability.forEach((avail, i) => {
        if (avail.startTime >= avail.endTime) {
          newErrors[`avail_${i}`] = 'Start time must be before end time';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        await onboardingMutation.mutateAsync(formData);
      } catch (err) {
        // Error handled by mutation
      }
    }
  };

  const isStepInvalid = useMemo(() => {
    // Basic reactive validation for UI state
    if (currentStep === 0) return !formData.fullName.trim();
    if (currentStep === 1) return formData.bio.length < ONBOARDING_CONSTANTS.BIO_MIN_LENGTH;
    if (currentStep === 2) return formData.subjects.length === 0 || formData.hourlyRate <= 0;
    return false;
  }, [currentStep, formData]);

  if (onboardingMutation.isSuccess) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold" style={{ color: '#2C1208' }}>Application Submitted!</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your tutor profile has been submitted for admin review. We'll notify you once your account is approved.
          </p>
        </div>
        <Button size="lg" className="px-12 font-bold shadow-lg shadow-primary/20" asChild>
          <Link href={ROUTES.TUTOR_DASHBOARD}>
            Go to My Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TutorOnboardingStepper steps={STEPS} currentStep={currentStep} />

      <Card className="border-border/60 shadow-xl shadow-primary/5 min-h-[450px] flex flex-col">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
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
        
        <CardContent className="pt-8 flex-1">
          {currentStep === 0 && <TutorPersonalStep data={formData} onChange={updateFormData} errors={errors} />}
          {currentStep === 1 && <TutorTeachingProfileStep data={formData} onChange={updateFormData} errors={errors} />}
          {currentStep === 2 && <TutorSubjectsRateStep data={formData} onChange={updateFormData} errors={errors} />}
          {currentStep === 3 && <TutorCertificatesStep data={formData} onChange={updateFormData} errors={errors} />}
          {currentStep === 4 && <TutorAvailabilityStep data={formData} onChange={updateFormData} errors={errors} />}
          {currentStep === 5 && <TutorReviewSubmitStep data={formData} onChange={updateFormData} />}
        </CardContent>

        <CardFooter className="border-t bg-muted/10 p-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.TUTOR_DASHBOARD}>Skip & Exit</Link>
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
              disabled={onboardingMutation.isPending}
            >
              {onboardingMutation.isPending ? (
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
