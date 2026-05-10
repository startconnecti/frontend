'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, Info, GraduationCap, DollarSign, Award, Calendar, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/constants/routes';
import { TutorOnboardingRequest } from '../types';
import { TutorOnboardingStepper } from './tutor-onboarding-stepper';
import { useCompleteTutorOnboardingMutation } from '../hooks/use-complete-tutor-onboarding-mutation';

const STEPS = [
  { title: 'Personal', icon: User },
  { title: 'Bio', icon: GraduationCap },
  { title: 'Rates', icon: DollarSign },
  { title: 'Certs', icon: Award },
  { title: 'Availability', icon: Calendar },
  { title: 'Review', icon: ShieldCheck },
];

export function TutorOnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const onboardingMutation = useCompleteTutorOnboardingMutation();
  
  // Typed local state for the form
  const [formData, setFormData] = useState<TutorOnboardingRequest>({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'undisclosed',
    bio: '',
    experienceText: '',
    yearsOfExperience: 0,
    hourlyRate: 20,
    subjects: [],
    certificates: [],
    weeklyAvailability: [],
    requestNote: '',
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async () => {
    try {
      await onboardingMutation.mutateAsync(formData);
    } catch (err) {
      // Error handled by mutation
    }
  };

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
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 max-w-md mx-auto">
          <p className="text-sm font-medium text-primary">Approval Status: Pending</p>
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

      <Card className="border-border/60 shadow-xl shadow-primary/5 min-h-[400px] flex flex-col">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {(() => {
                const Icon = STEPS[currentStep].icon;
                return <Icon className="h-5 w-5" />;
              })()}
            </div>
            <div>
              <CardTitle className="text-lg">{STEPS[currentStep].title} Information</CardTitle>
              <CardDescription>Step {currentStep + 1} of {STEPS.length}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 flex-1">
          {/* Step 1: Personal Information */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Full Name</label>
                  <Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Phone Number</label>
                  <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+1 234 567 890" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Info className="h-3 w-3" />
                  Gender and Date of Birth will be added in the next sub-phase.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Teaching Profile */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Professional Bio</label>
                <Textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleInputChange} 
                  placeholder="Tell students about yourself and your teaching style..." 
                  className="min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Years of Experience</label>
                <Input 
                  name="yearsOfExperience" 
                  type="number" 
                  value={formData.yearsOfExperience} 
                  onChange={handleNumericChange} 
                />
              </div>
            </div>
          )}

          {/* Step 3: Subjects & Rates */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Hourly Rate (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="hourlyRate" 
                    type="number" 
                    value={formData.hourlyRate} 
                    onChange={handleNumericChange} 
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="p-8 rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center text-center gap-3 bg-muted/5">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold">Subject Selection</p>
                  <p className="text-sm text-muted-foreground">Detailed subject picker will be implemented in the next sub-phase.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Certificates */}
          {currentStep === 3 && (
            <div className="space-y-4 py-8 flex flex-col items-center justify-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Award className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg">Verification of Credentials</h4>
                <p className="text-sm text-muted-foreground max-w-sm">
                  You will be able to upload your degree, certificates, and identity documents here in the next phase.
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">
                Mock File Upload Integration - Coming Soon
              </div>
            </div>
          )}

          {/* Step 5: Availability */}
          {currentStep === 4 && (
            <div className="space-y-4 py-8 flex flex-col items-center justify-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg">Weekly Schedule</h4>
                <p className="text-sm text-muted-foreground max-w-sm">
                  A comprehensive weekly availability grid will be implemented in the next phase.
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border/40 bg-muted/5 space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Full Name</p>
                  <p className="font-medium">{formData.fullName || 'Not provided'}</p>
                </div>
                <div className="p-4 rounded-xl border border-border/40 bg-muted/5 space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Hourly Rate</p>
                  <p className="font-medium">${formData.hourlyRate}/hr</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border/40 bg-muted/5 space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Experience</p>
                <p className="font-medium">{formData.yearsOfExperience} years</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800">
                  By submitting, you agree that your profile will be reviewed by our moderation team. You won't be visible in search results until approved.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t bg-muted/10 p-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.TUTOR_DASHBOARD}>Save & Exit</Link>
            </Button>
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
          </div>

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={nextStep} className="font-bold">
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
