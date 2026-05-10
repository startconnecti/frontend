'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROUTES } from '@/constants/routes';
import { GENDER_OPTIONS, ONBOARDING_CONSTANTS } from '../constants';
import { useCompleteStudentOnboardingMutation } from '../hooks/use-complete-student-onboarding-mutation';

const studentOnboardingSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'undisclosed']),
  interestedSubjects: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  learningGoal: z.string().max(ONBOARDING_CONSTANTS.LEARNING_GOAL_MAX_LENGTH, `Maximum ${ONBOARDING_CONSTANTS.LEARNING_GOAL_MAX_LENGTH} characters`).optional(),
});

type StudentOnboardingFormValues = z.infer<typeof studentOnboardingSchema>;

export function StudentOnboardingForm() {
  const onboardingMutation = useCompleteStudentOnboardingMutation();

  const form = useForm<StudentOnboardingFormValues>({
    resolver: zodResolver(studentOnboardingSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: 'undisclosed',
      interestedSubjects: [] as unknown as string, // Hack for RHF input
      learningGoal: '',
    },
  });

  const onSubmit = async (values: StudentOnboardingFormValues) => {
    try {
      await onboardingMutation.mutateAsync(values);
    } catch (err) {
      // Error handled by mutation
    }
  };

  if (onboardingMutation.isSuccess) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold" style={{ color: '#2C1208' }}>Welcome to Connecti!</h3>
          <p className="text-muted-foreground">
            Your profile has been successfully set up. You can now start booking sessions with our expert tutors.
          </p>
        </div>
        <Button size="lg" className="px-12 font-bold shadow-lg shadow-primary/20" asChild>
          <Link href={ROUTES.STUDENT_DASHBOARD}>
            Go to My Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="+1 234 567 890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="interestedSubjects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interested Subjects</FormLabel>
              <FormControl>
                <Input placeholder="Math, Physics, English (comma separated)" {...field} />
              </FormControl>
              <FormDescription>
                List the subjects you want to learn.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="learningGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Goals</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What are you hoping to achieve with tutoring?" 
                  className="min-h-[120px] resize-none"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Briefly describe your objectives (max 500 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            type="submit" 
            size="lg" 
            className="flex-1 font-bold shadow-lg shadow-primary/10" 
            disabled={onboardingMutation.isPending}
          >
            {onboardingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Profile...
              </>
            ) : (
              'Complete Onboarding'
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="lg" 
            className="flex-1"
            asChild
            disabled={onboardingMutation.isPending}
          >
            <Link href={ROUTES.STUDENT_DASHBOARD}>Skip for now</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
