'use client';

import { Check } from 'lucide-react';

interface Step {
  title: string;
}

interface TutorOnboardingStepperProps {
  steps: Step[];
  currentStep: number;
}

export function TutorOnboardingStepper({ steps, currentStep }: TutorOnboardingStepperProps) {
  return (
    <div className="relative flex justify-between w-full max-w-2xl mx-auto px-4 mb-8">
      {/* Progress Bar Background */}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-10" />
      
      {/* Active Progress Bar */}
      <div 
        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-10" 
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={index} className="flex flex-col items-center gap-2">
            <div 
              className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isCompleted 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : isActive 
                    ? 'bg-background border-primary text-primary ring-4 ring-primary/10' 
                    : 'bg-background border-muted text-muted-foreground'
              }`}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-bold">{index + 1}</span>
              )}
            </div>
            <span 
              className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
