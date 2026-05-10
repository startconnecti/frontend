'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ProfileSettings, UpdateProfileRequest } from '../types';
import { useUpdateProfileSettingsMutation } from '../hooks/use-update-profile-settings-mutation';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
});

interface ProfileSettingsFormProps {
  initialData: ProfileSettings;
}

export function ProfileSettingsForm({ initialData }: ProfileSettingsFormProps) {
  const updateMutation = useUpdateProfileSettingsMutation();
  
  const form = useForm<UpdateProfileRequest>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData.fullName,
      phoneNumber: initialData.phoneNumber,
      dateOfBirth: initialData.dateOfBirth,
      gender: initialData.gender,
    },
  });

  const onSubmit = (values: UpdateProfileRequest) => {
    updateMutation.mutate(values);
  };

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
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Email Address (Read-only)</FormLabel>
            <FormControl>
              <Input value={initialData.email} disabled className="bg-muted" />
            </FormControl>
          </FormItem>

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. +84 901 234 567" {...field} />
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
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Account Role</FormLabel>
            <FormControl>
              <Input value={initialData.role.charAt(0).toUpperCase() + initialData.role.slice(1)} disabled className="bg-muted capitalize" />
            </FormControl>
          </FormItem>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            className="font-bold px-8" 
            disabled={updateMutation.isPending || !form.formState.isDirty}
          >
            {updateMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
