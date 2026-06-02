
'use client';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateDisputeMutation } from '../hooks/use-create-dispute-mutation';

const createDisputeSchema = z.object({
  dispute_type: z.enum(['quality_issue', 'tutor_absent', 'ended_early', 'payment_issue', 'other'], {
    required_error: 'Please select a reason for the dispute',
  }),
  reason: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must not exceed 1000 characters'),
  requested_resolution: z.enum(['full_refund', 'partial_refund', 'reschedule', 'other']).optional(),
});

type CreateDisputeFormValues = z.infer<typeof createDisputeSchema>;

export interface StudentDisputeFormProps {
  sessionId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StudentDisputeForm({ sessionId, onSuccess, onCancel }: StudentDisputeFormProps) {
  const { mutate: createDispute, isPending } = useCreateDisputeMutation();

  const form = useForm<CreateDisputeFormValues>({
    resolver: zodResolver(createDisputeSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = (data: CreateDisputeFormValues) => {
    createDispute(
      {
        session_id: sessionId,
        dispute_type: data.dispute_type,
        reason: data.reason,
        requested_resolution: data.requested_resolution,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dispute_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Dispute</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="quality_issue">Poor session quality</SelectItem>
                  <SelectItem value="tutor_absent">Tutor was absent</SelectItem>
                  <SelectItem value="ended_early">Session ended early</SelectItem>
                  <SelectItem value="payment_issue">Incorrect amount charged</SelectItem>
                  <SelectItem value="other">Other issue</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe exactly what happened in as much detail as possible..."
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide any context that will help us investigate this issue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requested_resolution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested Resolution (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an outcome you'd prefer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="full_refund">Full Refund</SelectItem>
                  <SelectItem value="partial_refund">Partial Refund</SelectItem>
                  <SelectItem value="reschedule">Reschedule Session</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4 border-t border-border">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Dispute'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
