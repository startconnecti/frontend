'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2Icon, SaveIcon, AlertCircleIcon } from 'lucide-react';

const adminAccountSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['super_admin', 'moderator', 'finance', 'support', 'viewer']),
  status: z.enum(['active', 'inactive', 'suspended']),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
});

export type AdminAccountFormValues = z.infer<typeof adminAccountSchema>;

interface AdminAccountFormProps {
  initialValues?: Partial<AdminAccountFormValues>;
  onSubmit: (values: AdminAccountFormValues) => void;
  isLoading?: boolean;
  isEditMode?: boolean;
  /** Backend field errors mapped by field name */
  serverErrors?: Record<string, string>;
}

export function AdminAccountForm({
  initialValues,
  onSubmit,
  isLoading,
  isEditMode,
  serverErrors,
}: AdminAccountFormProps) {
  const form = useForm<AdminAccountFormValues>({
    resolver: zodResolver(adminAccountSchema),
    defaultValues: {
      fullName: initialValues?.fullName ?? '',
      email: initialValues?.email ?? '',
      role: initialValues?.role ?? 'viewer',
      status: initialValues?.status ?? 'active',
      password: '',
    },
  });

  // Hydrate form when async initialValues arrive (edit mode)
  useEffect(() => {
    if (initialValues) {
      form.reset({
        fullName: initialValues.fullName ?? '',
        email: initialValues.email ?? '',
        role: initialValues.role ?? 'viewer',
        status: initialValues.status ?? 'active',
        password: '',
      });
    }
  }, [initialValues, form]);

  // Map server-side errors onto form fields.
  // 'root' key signals a global business error (no specific field).
  useEffect(() => {
    if (serverErrors) {
      for (const [field, message] of Object.entries(serverErrors)) {
        if (field === 'root') {
          form.setError('root', { type: 'server', message });
        } else {
          form.setError(field as keyof AdminAccountFormValues, {
            type: 'server',
            message,
          });
        }
      }
    }
  }, [serverErrors, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Robert Wilson" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. robert@connecti.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Determines the permissions granted to this account.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!isEditMode && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temporary Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>The user will be prompted to change this on first login.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Root / business-level error banner */}
        {form.formState.errors.root?.message && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircleIcon className="h-4 w-4 shrink-0" />
            <span>{form.formState.errors.root.message}</span>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <SaveIcon className="h-4 w-4" />
            )}
            {isEditMode ? 'Update Admin Account' : 'Create Admin Account'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
