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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2Icon, SaveIcon, AlertCircleIcon } from 'lucide-react';

const subjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and contain only letters, numbers, and hyphens'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  initialValues?: Partial<SubjectFormValues>;
  onSubmit: (values: SubjectFormValues) => void;
  isLoading?: boolean;
  /** Pass true when used for editing (changes button label) */
  isEditMode?: boolean;
  /** Backend field errors keyed by field name, e.g. { slug: 'Slug already exists' } */
  serverErrors?: Record<string, string>;
}

export function SubjectForm({ initialValues, onSubmit, isLoading, isEditMode, serverErrors }: SubjectFormProps) {
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      slug: initialValues?.slug ?? '',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'active',
    },
  });

  // Hydrate form when async initialValues arrive (edit mode)
  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name ?? '',
        slug: initialValues.slug ?? '',
        description: initialValues.description ?? '',
        status: initialValues.status ?? 'active',
      });
    }
  }, [initialValues, form]);

  // Map server-side errors onto form fields.
  // Keys matching actual field names go under the field; 'root' is a global error.
  useEffect(() => {
    if (serverErrors) {
      for (const [field, message] of Object.entries(serverErrors)) {
        if (field === 'root') {
          form.setError('root', { type: 'server', message });
        } else {
          form.setError(field as keyof SubjectFormValues, {
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Mathematics" {...field} />
                </FormControl>
                <FormDescription>The display name of the subject.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. mathematics" {...field} />
                </FormControl>
                <FormDescription>URL-friendly identifier.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a brief description of what this subject covers..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="max-w-[200px]">
              <FormLabel>Status</FormLabel>
              {/* Use `value` + `onValueChange` so the select stays in sync after a reset */}
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
            {isEditMode ? 'Update Subject' : 'Create Subject'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
