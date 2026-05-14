'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { setFormErrors } from '@/lib/api/query-utils';
import { useCreateFeedbackMutation } from '../hooks/use-create-feedback-mutation';

const feedbackSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  comment: z.string().max(1000, 'Comment is too long').optional(),
});

interface FeedbackFormProps {
  sessionId: string;
  onSuccess: () => void;
}

export function FeedbackForm({ sessionId, onSuccess }: FeedbackFormProps) {
  const mutation = useCreateFeedbackMutation();
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    try {
      await mutation.mutateAsync({
        sessionId,
        ...values,
      });
      onSuccess();
    } catch (err) {
      setFormErrors(err, form.setError);
    }
  };

  const isSubmitting = mutation.isPending;

  const rating = form.watch('rating');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-black uppercase tracking-widest text-muted-foreground">Rate your experience</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        className={cn(
                          "h-10 w-10 transition-colors",
                          star <= rating 
                            ? "fill-primary text-primary" 
                            : "text-muted-foreground/30 hover:text-primary/50"
                        )} 
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-black uppercase tracking-widest text-muted-foreground">Your Feedback (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your experience with this tutor..." 
                  className="min-h-[150px] bg-muted/20 border-none rounded-2xl resize-none font-medium text-sm p-4 focus-visible:ring-1 focus-visible:ring-primary/20"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full h-14 font-black rounded-2xl text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
          disabled={isSubmitting || rating === 0}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
    </Form>
  );
}
